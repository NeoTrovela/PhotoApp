# **PhotoApp 📸**  
A cloud-based photo management application that allows users to upload, store, analyze, and search photos using AWS services.

## **Features 🚀**  
- 📤 **Upload Photos**: Users can upload images, which are stored in AWS S3 buckets.  
- 📥 **Download Photos**: Retrieve images from the cloud storage.  
- 🔍 **Photo Analysis**: Uses **AWS Rekognition** to analyze photos, generating labels with confidence scores.  
- 🏷 **Search by Labels**: Search for photos based on AI-generated labels.  
- 👤 **User Management**: Tracks users who upload images.  
- 📊 **Database Integration**: Uses **MySQL** to store metadata about users and assets.  
- 🏗 **RESTful API**: Web service follows RESTful API principles.  
- 🐳 **Docker Support**: Uses Docker for easy deployment.  
- ☁ **Cloud Deployment**: Hosted on **AWS Elastic Beanstalk / EC2**.  

---

## **Tech Stack 🛠**  
- **Backend**: Node.js, Express.js  
- **Frontend/Client**: Python  
- **Database**: MySQL  
- **Cloud Services**: AWS S3, AWS Rekognition, AWS Elastic Beanstalk  
- **Deployment**: Docker, AWS EC2  
- **Version Control**: Git, GitHub  

---

## **Setup & Installation 🏗**  

### **1. Clone the Repository**  
```bash
git clone https://github.com/yourusername/PhotoApp.git
cd PhotoApp
```

### **2. Install Dependencies**  
Instructions in _readme.txt in both folders

### **3. Set Up MySQL Database**  
1. Create a MySQL database.  
2. Run the provided SQL schema to create tables.  
3. Update the database credentials in the configuration files.

### **4. Run the Application**  
#### **Start the Web Service**  
```bash
cd photoapp-server-main
node app.js
```

#### **Run the Client**  
```bash
cd photoapp-client-main
python main.py
```

---

## **Usage Guide 📖**  
Once the application is running, users can perform the following actions:

| Command | Description |
|---------|------------|
| **stats** | Displays number of users and assets in the database. |
| **users** | Lists all registered users. |
| **assets** | Shows details of all uploaded photos. |
| **download** | Downloads a photo by asset ID (with an option to rename it). |
| **upload** | Uploads a photo to the cloud and associates it with a user ID. |
| **add_user** | Adds a new user and creates an S3 folder for them. |
| **analyze** | Uses AWS Rekognition to analyze a photo and return labels. |
| **search** | Searches for photos based on AI-generated labels. |

---

## **Future Improvements 🚀**  
- ✅ Enhance frontend UI (if applicable).  
- ✅ Implement user authentication.  
- ✅ Add more AI-powered analysis features.  

---

## **Authors 👨‍💻**  
- [Neo Trovela-Villamiel](https://github.com/NeoTrovela)  

---
