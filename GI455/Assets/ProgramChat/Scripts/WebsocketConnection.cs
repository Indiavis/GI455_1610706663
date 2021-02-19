using UnityEngine;
using WebSocketSharp;
using UnityEngine.UI;

namespace ProgramChat
{
    public class WebsocketConnection : MonoBehaviour
    {
        public GameObject messageBox;
        public GameObject connectPanel;
        public GameObject messagePanel;

        private WebSocket webSocket;
                  
        private string messageString;
        private string otherString;
        
        public InputField urlInput;
        public InputField portInput;
        public InputField inputField;  
     
        void Start()
        {
                 
        }
    
        void Update()
        {           
            
        }

        public void Connect() //1.กดปุ่ม Connect เพื่อเชื่อมต่อกับเซิร์ฟเวอร์
        {            
            webSocket = new WebSocket($"ws://{urlInput.text}:{portInput.text}/"); //1.1 ต่อ Port ให้ติด

            webSocket.OnMessage += OnMessage; //1.2 เพิ่มฟังก์ชั่นรับข้อความจากเซิร์ฟเวอร์

            webSocket.Connect(); //1.3 เชื่อมต่อกับเซิร์ฟเวอร์

            connectPanel.gameObject.SetActive(false);
            messagePanel.gameObject.SetActive(true);
        }
        
        public void Send() //2.หลังจากกรอก Inputfield message เพื่อส่งข้อความไปที่เซิร์ฟเวอร์
        {
            webSocket.Send(inputField.text); //2.1 ส่งข้อความจาก Inputfield ไปเซิร์ฟเวอร์
            GameObject container = Instantiate(messageBox, messagePanel.transform); //2.2 สร้างกล่องข้อความที่อยู่ใน message panel
            container.GetComponent<VerticalLayoutGroup>().childAlignment = TextAnchor.MiddleRight; //2.3 กำหนดให้ messageBox อยู่กลางขวา
            Text prefabText = container.transform.GetChild(0).GetComponent<Text>(); //2.4 เอา Compnent text จาก 0 ใน container
            prefabText.alignment = TextAnchor.MiddleRight;
            prefabText.text = inputField.text;
            
        }


        private void OnDestroy()
        {
            if (webSocket != null)
            {
                webSocket.Close();
            }
        }

        public void OnMessage(object sender , MessageEventArgs messageEventArgs)
        {
            Debug.Log("Receive msg : " + messageEventArgs.Data);
            otherString = messageEventArgs.Data;
            GameObject container = Instantiate(messageBox, messagePanel.transform);
            container.GetComponent<VerticalLayoutGroup>().childAlignment = TextAnchor.MiddleLeft;
            Text prefabText = container.transform.GetChild(0).GetComponent<Text>();           
            prefabText.text = otherString;
        }
    }
}

