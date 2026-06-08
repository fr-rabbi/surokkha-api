
from flask import Flask, render_template, request, redirect
import sqlite3, os, requests

app = Flask(__name__)

BOT_TOKEN=os.getenv("BOT_TOKEN","")
CHAT_ID=os.getenv("CHAT_ID","")

def init_db():
    conn=sqlite3.connect("database.db")
    conn.execute("CREATE TABLE IF NOT EXISTS letters(id INTEGER PRIMARY KEY,message TEXT,created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
    conn.commit(); conn.close()

def notify(msg):
    if BOT_TOKEN and CHAT_ID:
        requests.post(f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage",
                      data={"chat_id":CHAT_ID,"text":msg})

init_db()

@app.route("/", methods=["GET","POST"])
def home():
    if request.method=="POST":
        msg=request.form["message"]
        conn=sqlite3.connect("database.db")
        conn.execute("INSERT INTO letters(message) VALUES(?)",(msg,))
        conn.commit(); conn.close()
        notify("নতুন চিঠি এসেছে!")
        return redirect("/success")
    return render_template("index.html")

@app.route("/success")
def success():
    return render_template("success.html")

if __name__ == "__main__":
    app.run()
