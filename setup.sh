dns=$1
append_line_no_nginx=60
nginx_path=/etc/nginx/nginx.conf
server_config="
     server_names_hash_bucket_size 128;

	server {
		listen 80;
		server_name $dns;

		location / {
		    proxy_pass http://localhost:3000;
		    proxy_http_version 1.1;
		    proxy_set_header Upgrade \$http_upgrade;
		    proxy_set_header Connection 'upgrade';
		    proxy_set_header Host \$host;
		    proxy_cache_bypass \$http_upgrade;
		}

		location /api {
        		proxy_pass http://localhost:4000/api;
        		proxy_set_header Host \$host;
        		proxy_set_header X-Real-IP \$remote_addr;
        		proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        		proxy_set_header X-Forwarded-Proto \$scheme;
    	}
    }
"

echo "GOTO base dir"
cd ~

echo "Changing base API in nuxt.config.ts"
sudo sed -i "s/localhost:4000/$dns/g" "./workspace/bomb-mail/app/nuxt.config.ts"


echo "Installing Docker and Docker Compose"
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "Restarting Docker"
sudo systemctl restart docker


echo "Installing NGINX"
sudo apt update && sudo apt-get install -y nginx

echo "Setting up NGINX"
sudo head -n $append_line_no_nginx "$nginx_path" > temp_file
echo "$server_config" >> temp_file
sudo tail -n +$(($append_line_no_nginx + 1)) "$nginx_path" >> temp_file
sudo mv temp_file "$nginx_path"

sudo nginx -s reload


echo "Starting app"
cd ./workspace/bomb-mail/
sudo docker compose up --build -d