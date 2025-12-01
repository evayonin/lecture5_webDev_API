import {useEffect, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
//באפליקציית ריאקט נעשה בקשת שרת-לקוח עם API
//ספק API: אפליקציה צד שרת איזשהו שנותן מידע...
//אם רוצים לבקש שירות משרת->הם מביאים סוג של סיסמה/טוקן->ואז עם הטוקן הזה אתה מזדהה
//באתר Fixer API זהו אתר שמספק API שמאוד נוח לעבוד איתו. יש פשוט כמות בקשות חינמית מוגבלת.
//לכל ספק API יש לו דוקומנטציה. אם אלחץ על הדוקומנטציה באתר-> אראה שיש הסבר למה שהAPI מביא לי
// כך נדע איך להשתמש עם הטוקן.
// כמובן שאם הייתה בעיה בפרמטר ששלחתי או שבכלל לא שלחתי נראה את זה בגייסון בשדה success וגם יהיה שדה עם הסבר.
// אגב בגירסה החינמית fixer משווה את כל המטבעות ביחס ליורו.
//נבקש מהם 2 דברים: 1. נבקש מידע על שער חליפין. 2. סימבול-זה בעצם הסמלים של המטבעות (פשוט שם תצוגה) ונרצה להשתמש במידע הזה.
//אם אני סתם שמה בנתיב הבקשה רק את הטוקן כפרמטר אז יציג לי את הסימבולים שזה פשוט רק שמות המטבעות.
//קודם כל בשביל לשלוח בקשות נצטרך להתקין ספריות בפרויקט. הספריה הכי מומלצת היא axios. נלך לטרמינל ונכתוב: npm install axios
//זוהי ספריה שמאפשרת לשלוח בקשות API, ואיתה אנחנו נעבוד.
// זה הוסף לבד ב dependencies ב package.json.

// באופן כללי:
//לאפליקציה יש מודל api שאפשר לתת לה שם של מישהו שתוסיף אותו למשתמשי שירות השרת שלה.
// אני פותחת אצלם חשבון והם נותנים לי טוקן כך שכל פעם שארצה מהם שירות אשתמש בטוקן(ססמה מי אני מאחורי הקלעים). ככה גם ידעו לגבות ממני את התשלום.

// נשלח את הבקשה לפי useState ולא קומפוננטת מחלקה.

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


    useEffect(() => { //כאן הדברים שיקרו מיד כשהקומפוננטה עולה
        axios.get("https://data.fixer.io/api/symbols?access_key=445f4d448d390153a4a5691606115666") // בקשת גט עם הטוקן
            .then(response =>{ // זה אומר - שלח בקשה וכשתגיע תגובה תעשה איתה את הדברים הבאים:
                // console.log(response.data)//מדפיס את הגייסון בקונסול, ניתן לראות אם רוצים לבדוק שזה בכלל עובד דרך הדפדפן -> בדיקה -> קונסול
                const options = []//מערך ריק, נדחוף לשם בשורה 32 את האופציות שלנו...
                Object.keys(response.data.symbols).forEach(key=>{//מסתכלים מה שהAPI מחזיר, אנו רואים שיש שם מפתח שנקרא symbols עטפתי אותו במשהו שנקרא object.keys שזה בעצם מביא לי את כל המפתחות בגייסון מהתגובה ואז עבור כל אחד מהמפתחות סימבולים עושים משהו:
                    //object.keys זה בעצם כל המפתחות
                    //על כל מפתח (forEach) אני יוצרת אובייקט ג'ייסון, ה״קוד״ שלו זה המפתח לדוגמה "ILS". והדיספליי שלו זה ערך הסימבול במפתח הזה לדוגמה "Israeli New Shekel".
                    const optionsToAdd = {
                        code: key,
                        display: response.data.symbols[key] // נציג את הערך (הדיספליי) של אותו מפתח סימבול הזה במערך הסימבולים בגייסון
                    };
                    options.push(optionsToAdd) // דחיפת כל אובייקט למערך
                })
                setAvailableSymbols(options);//בעקרון עשינו סוג של מעבר: מהAPI כאן העברנו לסטייט כי עשינו לו סט, ואז מה שיש בסט אנחנו מציגים בריטרן (אם המערך ריק בסט אנחנו לא נראה כלום אבל בעצם אנחנו כן מציגים)
            })
        },[]);

  return (
    <>
        הAPI הראשון שלי
        <br/>
        <input type ={"number"} // אינפוט לכמות כסף שאני רוצה להמיר
               value={money}
               placeholder={"How much money do you want to exchange?"} onChange={event =>{
                   setMoney(event.target.value)
        }}/>
        <br/>
        <select value={selectedSymbol} onChange ={event =>{ // ייתן ליוזר לבחור מטבע
            setSelectedSymbol(event.target.value);//על מנת שנוכל לשנות אותו מבחוץ דרך הסטייט, איך זה עובד? כשיוזר בוחר באופציה-> הקומפוננטה מתרנדרת מחדש והסט שלו הופך לאופציה שהוא בחר ולכן זה מה שיהיה מוצג
        }}>{/*הערך ההתחלתי יהיה פשוט נאל, נעשה איזשהו משתנה בסטייט ונגדיר מה שבחרו כרגע*/}
            {/*הערה: ככה עושים דרופדאון, ואלה האופציות שאני יכולה לשים*/}
            {/*<option value={"ILS"}> Shekel </option>
            אם עשיתי ככה אז זה יראה לי רק את הדבר הזה^ מכל הג׳ייסון. ז״א רק את הערך "ILS" של selected symbol.
            /!*מה שבתוך הוואליו זה פשוט שם משתנה, השקל שכתבתי זה מה שיהיה מוצג. אבל אנחנו לא נעשה כך (כל הדבר הזה יהיה הערה)*!/
            אבל איך נותנים ערך התחלתי כשעוד לא בחרתי כלום מהאופציות? - נותנים ערך "none" בהתחלה ובלי האפשרות לבחור בה(דיסאייבלד).*/}
            <option disabled={true} value ={"none"}> Select an option</option>
            { // האפשרויות שניתן למשתמש לבחור באותה האופציה:
                // נציג לו את כל הסימבולים כאפשרויות שניתן לבחור מתוכם
                availableSymbols.map(item =>{ // עבור כל סימבול (שחזר מהבקשת גט) נרנדר אותו עם הקוד (הראשי טיבות) והדיספליי
                    return (
                        <option value={item.code}>{item.display}</option>
                    )
                })
            }
        </select>

        { // הצגת כפתור לחישוב ההמרה אם נבחר סימבול והוכנס סכום:
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
                            const relevantRate = response.data.rates[selectedSymbol];//בעצם יקח מתוך הסלקטד סימבול (רק את מה שאני רוצה) וישלוף משם בדיוק את השווי הזה לפני המפתח (כי אני לא צריכה את כל הרשימה הארוכה..)
                            setExchangeRate(relevantRate);
                        })
                }}>
                Calculate currency
            </button>
        }
        { // הצגת ההמרה ע״י חישוב: מ
              <div>
            Exchange rate {exchangeRate*money // החישוב שמראים בהמרת הסכום שהוכנס עבור המטבע, ליורו
              }
            </div>
        }
    </>
  )
}

export default App
