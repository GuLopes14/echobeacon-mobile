import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { ConnectionStatus, OnMessageCallback } from "../types";
import useMqttClient from "../hooks/useMqttClient";
import { IClientOptions } from "mqtt";
import { db } from "../../../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type MqttContextProps = {
  status?: ConnectionStatus;
  subscribe: (topic: string, onMessage: OnMessageCallback) => void;
  unsubscribe: (topic: string) => void;
  publish: (topic: string, message: string) => void;
  // connect can accept either an IClientOptions object or a URL string (ws://... or mqtt://...)
  connect: (options: IClientOptions | string) => void;
  disconnect: () => void;
};

const MqttContext = createContext<MqttContextProps>({} as MqttContextProps);

const MqttProvider = ({ children }: PropsWithChildren) => {
  // Auto-connect by default to HiveMQ public broker over WebSocket so UI doesn't need an explicit connect
  const [options, setOptions] = useState<IClientOptions | string | undefined>(
    // Use WebSocket endpoint which works well from React Native / browsers
    'ws://broker.hivemq.com:8000/mqtt'
  );

  const {
    status,
    subscribe: mqttSubscribe,
    disconnect,
    unsubscribe: mqttUnsubscribe,
    publish: mqttPublish,
  } = useMqttClient(options as any);

  // Wrapper publish that also logs commands to Firestore
  const publish = (topic: string, message: string) => {
    try {
      // send via mqtt
      mqttPublish(topic, message);
    } catch (err) {
      console.error("Erro ao publicar via MQTT:", err);
    }

    // Log publish to Firestore (non-blocking)
    (async () => {
      try {
        const payloadObj = (() => {
          try {
            return JSON.parse(message);
          } catch (e) {
            return { raw: message };
          }
        })();

        await addDoc(collection(db, "echobeacon_logs"), {
          direction: "outgoing",
          topic,
          payload: payloadObj,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.error("Erro ao gravar log de publish no Firestore:", error);
      }
    })();
  };

  const connect = (opts: IClientOptions | string) => {
    setOptions(opts);
  };

  const subscribe = (topic: string, onMessage: OnMessageCallback) => {
    mqttSubscribe(topic, onMessage);
  };

  const unsubscribe = (topic: string) => {
    mqttUnsubscribe(topic);
  };

  // Auto-subscribe to status topic when connected and log incoming messages
  useEffect(() => {
    if (status !== "connected") return;

    const topic = "fiap/iot/echobeacon/status";

    const handleMessage = async (t: string, message: string) => {
      // attempt parse
      let payloadObj: any = { raw: message };
      try {
        payloadObj = JSON.parse(message);
      } catch (e) {
        // keep raw
      }

      try {
        await addDoc(collection(db, "echobeacon_logs"), {
          direction: "incoming",
          topic: t,
          payload: payloadObj,
          timestamp: serverTimestamp(),
        });
      } catch (error) {
        console.error("Erro ao gravar log de status no Firestore:", error);
      }
    };

    subscribe(topic, handleMessage);

    // cleanup
    return () => {
      unsubscribe(topic);
    };
  }, [status]);

  return (
    <MqttContext.Provider
      value={{
        connect,
        disconnect,
        subscribe,
        unsubscribe,
        publish,
        status,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export { MqttContext, MqttProvider };
