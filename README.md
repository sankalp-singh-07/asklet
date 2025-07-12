## 🚀 Selected Problem Statement

---

_Problem Statement 1: AskLet – A Minimal Q&A Forum Platform_

# Asklet – A Minimal Q&A Forum

Asklet is a minimalistic Question-and-Answer (Q&A) forum platform developed as part of the Odoo Hackathon '25. It aims to foster structured knowledge sharing and collaborative learning in a clean, user-friendly environment.

## 🔑 Core Features

### 👥 User Roles

| Role  | Permissions                                    |
| ----- | ---------------------------------------------- |
| Guest | View all questions and answers                 |
| User  | Register, log in, post questions/answers, vote |
| Admin | Moderate content                               |

---

### 📝 Question Posting

-   Title (short and descriptive)
-   Description (Rich Text Editor)
-   Tags (multi-select input, e.g., React, JWT, etc.)

---

### 🧰 Rich Text Editor Functionalities

-   Bold, Italic, Strikethrough
-   Numbered & Bullet Lists
-   Emojis 😀
-   Hyperlinks
-   Image Upload
-   Text Alignment (Left, Center, Right)

---

### 💬 Answering & Voting

-   Users can post answers using the rich text editor
-   Logged-in users can upvote/downvote answers
-   Question owners can mark one answer as accepted

---

### 🔔 Notification System

-   Bell icon in the top navigation bar
-   Notifications when:
    -   Someone answers their question
    -   Someone comments on their answer
    -   Someone mentions them using @username
-   Unread notification count
-   Dropdown to view recent notifications

---

## 🔧 Technologies Used

-   _Frontend:_ Next.js
-   _Backend:_ Next.js
-   _Database:_ PostgreSQL
-   _Authentication:_ NextAuth.js
-   _Styling:_ TailwindCSS

---

## 🛠 Setup Instructions

bash

# Clone the repository

git clone https://github.com/sankalp-singh-07/asklet.git
cd asklet

# Install dependencies

npm install # or pip install -r requirements.txt if backend is Python

# Start the dev server

npm start
