using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WebSocketSharp;
using System;
using UnityEngine.UI;

namespace ChatWebSocketWithJson
{
    public class WebSocketConnection : MonoBehaviour
    {
        public class MessageData
        {
            public string username;
            public string message;
            public MessageData(string username, string message)
            {
                this.username = username;
                this.message = message;
            }
        }

        struct SocketEvent
        {
            public string eventName;
            public string data;

            public SocketEvent(string eventName , string data)
            {
                this.eventName = eventName;
                this.data = data;
            }
        }
        public GameObject rootConnection;
        public GameObject rootMessenger;

        public InputField inputUsername;
        public InputField inputText;
        public Text sendText;
        public Text receiveText;
        
        private WebSocket ws;

        private string tempMessageString;

        public void Start()
        {
            rootConnection.SetActive(true);
            rootMessenger.SetActive(false);
        }

        public void Connect()
        {
            string url = $"ws://127.0.0.1:8080/";

            ws = new WebSocket(url);

            ws.OnMessage += OnMessage;

            ws.Connect();

            rootConnection.SetActive(false);
            rootMessenger.SetActive(true);
        }

        public void CreateRoom(string roomName)
        {
            if(ws.ReadyState == WebSocketState.Open)
            {
                SocketEvent socketEvent = new SocketEvent("CreateRoom", roomName);

                string jsonstr = JsonUtility.ToJson(socketEvent);

                ws.Send(jsonstr);
            }
        }

        public void Disconnect()
        {
            if (ws != null)
                ws.Close();
        }
        
        public void SendMessage()
        {
            if (inputText.text == "" || ws.ReadyState != WebSocketState.Open)
                return;

            MessageData newMessageData = new MessageData(inputUsername.text ,inputText.text);
            newMessageData.username = inputUsername.text;
            newMessageData.message = inputText.text;

            string toJsonStr = JsonUtility.ToJson(newMessageData);
            ws.Send(inputText.text);
            inputText.text = "";
        }

        private void OnDestroy()
        {
            if (ws != null)
                ws.Close();
        }

        private void Update()
        {
            if (string.IsNullOrEmpty(tempMessageString)==false)
            {
                MessageData receiveMessageData = JsonUtility.FromJson<MessageData>(tempMessageString);

                if(receiveMessageData.username == inputUsername.text)
                {
                    sendText.text += receiveMessageData.username + ": " + receiveMessageData.message+ "\n";
                }
                else
                {
                    receiveText.text += receiveMessageData.username + ": " + receiveMessageData.message + "\n";
                }
                receiveText.text += tempMessageString + "\n";
                tempMessageString = "";
            }
        }

        private void OnMessage(object sender, MessageEventArgs messageEventArgs)
        {
            tempMessageString = messageEventArgs.Data;
        }
    }
}


