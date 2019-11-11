## Steps to build

- Clone this repo first and `cd` into it.
- Was tested and successfully working on Ubuntu 16.04 GCP VM

### Initial Setup
```
sudo apt-get update
#### Disable firewall
sudo ufw disable
sudo iptables -F
```
- Ensure all the ingress/egress ports are open in your computer/VM.


### Building the backend

```
cd hope/
```

#### Setting up the DB


##### Install MySQL
```bash
sudo apt install mysql-server
sudo service start mysql
```
- Ensure you know the root password of MySQL, which you'll have to enter below.

##### Creating the DB schema
```bash
mysql -u root -e "CREATE DATABASE hope" -p
mysql -u root -e "CREATE USER dataturks@'127.0.0.1' IDENTIFIED BY '12345';" -p
mysql -u root -e "GRANT SELECT, INSERT, UPDATE, DELETE ON hope.* TO dataturks@127.0.0.1;FLUSH PRIVILEGES;" -p
mysql -u root hope -p < docker/mysqlInit.sql
```

#### Setting up the server stack
```
sudo apt install apache2 php7.0 libapache2-mod-php7.0
sudo cp docker/onprem-dataturks.com.conf /etc/apache2/sites-available/
sudo cp docker/onprem-dataturks.com.conf /etc/apache2/sites-available/000-default.conf
sudo a2enmod proxy_http
sudo service apache2 restart
sudo a2enmod php7.0
sudo a2ensite onprem-dataturks.com.conf
sudo service apache2 reload
```

#### Building `hope` (DataTurk's Java backend)
```
sudo apt install default-jdk maven
mvn package -DskipTests
```

#### Starting the backend server
```
java -Djava.net.useSystemProxies=true -server -jar target/dataturks-1.0-SNAPSHOT.jar server onprem.yml
```
- Don't kill it.
- You might have to open a new Terminal to continue further steps.

### Building the frontend

```
cd bazaar/
chmod -R 777 *
```

#### Setting up NodeJS

```
sudo apt install build-essential nodejs
curl -sL https://deb.nodesource.com/setup_8.x >/tmp/install_node.sh
chmod 777 /tmp/install_node.sh
sudo /tmp/install_node.sh
sudo npm i -g nodemon
```

#### Building `bazaar` (DataTurk's frontend)
```
npm install
npm run build-onprem
npm prune
```

#### Starting the frontend service
```
npm run start-onprem
```

- Now, you should be able to go to [http://localhost:3000](http://localhost:3000) and view the on-prem website.
- What now? Go mind your own business.

