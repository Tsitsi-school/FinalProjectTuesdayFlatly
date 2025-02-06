#!/bin/bash

# Configuration
EC2_USER="ec2-user"  # Change this if using Ubuntu (e.g., 'ubuntu')
EC2_HOST="3.67.172.45"
PEM_KEY="~/.ssh/ec2.pem"  # Update with your actual key path
LOCAL_JAR_PATH="target/demo-0.0.1-SNAPSHOT.jar"  # Adjust with the correct JAR location
REMOTE_DIR="/home/ec2-user/app"  # Deployment directory on EC2
JAR_NAME="backend.jar"
APP_PORT=8080  # Change if your app runs on a different port

echo "Starting deployment to $EC2_HOST..."

# Step 1: Upload JAR to EC2
echo "Uploading JAR file to EC2..."
scp -i $PEM_KEY $LOCAL_JAR_PATH $EC2_USER@$EC2_HOST:$REMOTE_DIR/$JAR_NAME

# Step 2: Connect to EC2 and restart the application
echo "Restarting application on EC2..."
ssh -i $PEM_KEY $EC2_USER@$EC2_HOST <<EOF
    # Stop any existing application running on the port
    echo "Checking for existing application on port $APP_PORT..."
    PID=\$(lsof -t -i:$APP_PORT)
    if [ ! -z "\$PID" ]; then
        echo "Stopping existing application (PID: \$PID)..."
        kill -9 \$PID
    fi

    # Ensure the deployment directory exists
    mkdir -p $REMOTE_DIR

    # Start the new application
    echo "Starting new application..."
    nohup java -jar $REMOTE_DIR/$JAR_NAME > $REMOTE_DIR/app.log 2>&1 &

    # Verify that the app is running
    sleep 5
    NEW_PID=\$(lsof -t -i:$APP_PORT)
    if [ -z "\$NEW_PID" ]; then
        echo "Application failed to start. Check logs at $REMOTE_DIR/app.log"
    else
        echo "Application started successfully (PID: \$NEW_PID)"
    fi
EOF

echo "Deployment complete!"
