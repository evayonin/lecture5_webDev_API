import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//באפליקציית ריאקט נעשה בקשת שרת-לקוח עם API
//ספק API: אפליקציה צד שרת איזשהו שנותן מידע...
//אם רוצים לבקש שירות משרת->הם מביאים סוג של סיסמה/טוקן->ואז עם הטוקן הזה אתה מזדהה
//באתר Fixer API זהו אתר שמספק API שמאוד נוח לעבוד איתו
//לכל ספק API יש לו דוקומנטציה. אם אלחץ על הדוקומנטציה באתר-> אראה שיש הסבר למה שהAPI מביא לי
//נבקש מהם 2 דברים: 1. נבקש מידע על שער חליפין. 2. סימבול-זה בעצם הסמלים של המטבעות (פשוט שם תצוגה) ונרצה להשתמש במידע הזה
//קודם כל בשביל לשלוח בקשות נצטרך להתקין ספריות בפרויקט. הספריה הכי מומלצת היא axios. נלך לטרמינל ונכתוב: npm install axios
//זוהי ספריה שמאפשרת לשלוח בקשות API, ואיתה אנחנו נעבוד.

import axios from "axios"; //כדי לעבוד איתה נעשה אימפורט לספריה
function App() {

    const [selectedSymbol, setSelectedSymbol] = useState("none");
    const [money,setMoney]= useState(100)
    const [availableSymbols, setAvailableSymbols] = useState([])
    const [exchangeRate, setExchangeRate] = useState(0)
    //     code:"ILS",
    //     display:"Shekel"
    // },{
    //     code:"USD",
    //     display:"US dollar"
    // },{
    //     code:"GBP",
    //     display:"Pound"
    // }])
//לא נרצה שבכלל המידע יהיה בסטייס (כמו שיש למעלה^) ולכן גם את זה נמחק ונסמן כהערה...


    useEffect(() => {//הדברים יקרו מיד כשהקומפוננטה עולה
        axios.get("https://data.fixer.io/api/symbols?access_key=445f4d448d390153a4a5691606115666")
            .then(response =>{
                // console.log(response.data)//מדפיס בקונסול, ניתן לראות אם רוצים לבדוק שזה בכלל עובד דרך הדפדפן -> בדיקה -> קונסול
                const options = []//מערך ריק, נדחוף לשם בשורה 43 את האופציות שלנו...
                Object.keys(response.data.symbols).forEach(key=>{//מסתכלים מה שהAPI מחזיר, אנו רואים שיש שם מפתח שנקרא symbols עטפתי אותו במשהו שנקרא object.keys
                    //object.keys זה בעצם כל המפתחות
                    //על כל מפתח (forEach) אני יוצרת ג'ייסון, הקוד שלו זה המפתח. והדיספליי שלו זה הסימבול במיקום של המפתח
                    const optionsToAdd = {
                        code: key,
                        display: response.data.symbols[key]
                    };
                    options.push(optionsToAdd)
                })
                setAvailableSymbols(options);//בעקרון עשינו סוג של מעבר: מהAPI כאן העברנו לסטייט כי עשינו לו סט, ואז מה שיש בסט אנחנו מציגים בריטרן (אם המערך ריק בסט אנחנו לא נראה כלום אבל בעצם אנחנו כן מציגים)
            })
        },[]);

  return (
    <>
        הAPI הראשון שלי
        <br/>
        <input type ={"number"}
               value={money}
               placeholder={"How much money do you want to exchange?"} onChange={event =>{
                   setMoney(event.target.value)
        }}/>
        <br/>
        <select value={selectedSymbol} onChange ={event =>{
            setSelectedSymbol(event.target.value);//על מנת שנוכל לשנות אותו מבחוץ דרך הסטייט, איך זה עובד? כשיוזר בוחר באופציה-> הקומפוננטה מתרנדרת מחדש והסט שלו הופך לאופציה שהוא בחר ולכן זה מה שיהיה מוצג
        }}>{/*הערך ההתחלתי יהיה פשוט נאל, נעשה איזשהו משתנה בסטייט ונגדיר מה שבחרו כרגע*/}
            {/*הערה: ככה עושים דרופאון, ואלה האופציות שאני יכולה לשים*/}
            {/*<option value={"ILS"}> Shekel </option>/!*מה שבתוך הוואליו זה פשוט שם משתנה, השקל שכתבתי זה מה שיהיה מוצג. אבל אנחנו לא נעשה כך (כל הדבר הזה יהיה הערה)*!/*/}
            <option disabled={true} value ={"none"}> Select an option</option>
            {
                availableSymbols.map(item =>{
                    return (
                        <option value={item.code}>{item.display}</option>
                    )
                })
            }
        </select>

        {
            selectedSymbol!="none" && money > 0 &&//האנד בסוף השורה מציג את התנאי שירנדר רק אם התנאי הזה קורה. האנד בהתחלה זה "וגם"
            <button
                style={{
                    fontStyle: "italic",//סתם כי בא לי (:
                    color:"purple",
                    fontWeight: "bold",
                }}
                onClick={event =>{
                    //בפנים אנחנו נשלח בקשה, כי נרצה לחשב רק אחרי שנלחץ..
                    axios.get("https://data.fixer.io/api/latest?access_key=445f4d448d390153a4a5691606115666")
                        .then(response=>{
                            const relevantRate = response.data.rates[selectedSymbol];//בעצם יקח מתוך הסלקטד סימבול (רק את מה שאני רוצה) וישלוף משם בדיוק את השווי הזה (כי אני לא צריכה את כל הרשימה הארוכה..)
                            setExchangeRate(relevantRate);

                        })
                }}>
                Calculate currency:3
            </button>
        }
        {
              <div>
            Exchange rate {exchangeRate*money}
            </div>
        }
    </>
  )
}

export default App
