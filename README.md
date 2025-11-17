# Jimmy_English_Quiz_System

## 簡介

**Jimmy English Quiz System** 是一款專為提升學生英語考試而設計的測驗系統(線上填鴨系統ㄏㄏ)，基於 [opensource-coding/Javascript-Quiz-App](https://github.com/opensource-coding/Javascript-Quiz-App) 改良並添加一些功能，包括答題後的公開檢討模組。  
本系統適用於國中學生，支援多樣化題型及分析功能，能有效提升學生的學習動機與成效。

---

## 功能特色

1. **單選題 (Multiple Choice)**

- 目前題庫以國中考古題為主（例如翰林版國一 / 國二段考題），集中在 `custom.js` 中維護。
- 題目來源多為各校段考與過去的「全國中小學考古題網站」（已下線 QQ），題幹與選項皆可自行擴充與改寫。

2. **即時答題結果**
   - 提供即時的答對/答錯回饋，幫助學生了解學習狀況。
     ![image](https://github.com/a88019401/a88019401-Jimmy_English_Quiz_System/blob/main/images/1.png)
     ![image](https://github.com/a88019401/a88019401-Jimmy_English_Quiz_System/blob/main/images/2.png)

- 每題作答後即顯示「正確 / 錯誤」標示：
  - 正確選項會標成綠色框線
  - 使用者選錯的選項會以紅色框線標示
- 測驗結束後會顯示一個「作答詳情區塊」：
  - 題目內容
  - 你的答案
  - 正確答案
- 方便學生自我檢討，也方便老師投影帶全班一起檢討。

3. **響應式設計**

- 使用簡潔的 HTML + CSS，版面針對桌面裝置與手機皆有良好顯示。
- 選項區塊有較大的間距與 hover 效果，方便學生在手機上點擊。
---

4. **Google 試算表排行榜**

為了讓系統 **不用再自己維護後端資料庫與伺服器**，目前改為使用：

- **Google Apps Script (Code.gs) + Google 試算表** 當作簡易後端
- 前端直接以 `fetch` 呼叫 Apps Script Web App URL 來：
  - `POST`：上傳成績
  - `GET`：取得排行榜資料（前 10 名或自訂）