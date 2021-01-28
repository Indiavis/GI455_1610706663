using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class Text_Checking : MonoBehaviour
{
    public List<string> textPanelList; //สร้าง List ขึ้นมา

    public Text textPanel; //text ใน Panel
    public Text textResult; //text ใน ข้อความแสดงผล
    public InputField textInput; //ตัวแปรที่ text Input เข้ามา

    void Start()
    {
        textPanelList = new List<string>() { "Hichat", "Pogchamp", "OmegaLUL", "Iwashere", "OMG" };
        textPanel.text = string.Join("\n", textPanelList);             
    }

    public void OnClick()
    {
        foreach(var item in textPanelList)
        {
            if(item == textInput.text)
            {
                textResult.text = $" [ <color=green>{textInput.text}</color> ] is found ";
                return;
            }
            else
            {
                textResult.text = $" [ <color=red>{textInput.text}</color> ] is not found ";
            }
        }
    }

    // Update is called once per frame
    void Update()
    {
      
    }
}
    

