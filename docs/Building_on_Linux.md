## Steps to build from source

- Clone this repo first and `cd` into it.
- Was tested and successfully working on Ubuntu 16.04 GCP VM and Ubuntu 18.04 locally.
- If you're feeling lazy to build from scratch, use [this pre-built docker image](https://medium.com/@dataturks/dataturks-on-prem-a-fully-self-hosted-data-annotation-solution-86b455bf0634).

### Building the backend

```
cd hope/
```

#### Setting up the DB
##### Install MySQL
```bash
sudo apt install -y mysql-server
sudo service mysql start
```
- Ensure you know the [root password](https://stackoverflow.com/a/54165621/5002496) of MySQL, which you'll have to enter below.

##### Creating the DB schema
```bash
sudo mysql -u root -e "CREATE DATABASE hope" -p
sudo mysql -u root -e "CREATE USER dataturks@'127.0.0.1' IDENTIFIED BY '12345';" -p
sudo mysql -u root -e "GRANT SELECT, INSERT, UPDATE, DELETE ON hope.* TO dataturks@127.0.0.1;FLUSH PRIVILEGES;" -p
sudo mysql -u root hope -p < docker/mysqlInit.sql
```

#### Building `hope` (DataTurk's Java backend)
```
sudo apt update
sudo apt install -y openjdk-8-jdk openjdk-8-jre maven
mvn package -DskipTests
```
(Ensure that `java -version` command gives the java version as `1.8`)

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

#### Setting up the apache server stack

```
sudo apt install -y apache2 php7.0 libapache2-mod-php7.0
sudo a2enmod proxy_http
sudo a2enmod php7.0
sudo service apache2 restart

sudo cp ../hope/docker/onprem-dataturks.com.conf /etc/apache2/sites-available/
sudo sed -i "s|/home/dataturks/bazaar|`pwd`|g" /etc/apache2/sites-available/onprem-dataturks.com.conf
sudo a2dissite 000-default.conf
sudo a2ensite onprem-dataturks.com.conf

sudo cp ../hope/docker/dataturks-ssl.conf /etc/apache2/sites-available/
sudo sed -i "s|/home/dataturks/bazaar|`pwd`|g" /etc/apache2/sites-available/dataturks-ssl.conf
sudo a2ensite default-ssl.conf

sudo service apache2 restart
```

#### Setting up NodeJS

```
sudo apt install -y build-essential
curl -sL https://deb.nodesource.com/setup_8.x >/tmp/install_node.sh
chmod 777 /tmp/install_node.sh
sudo /tmp/install_node.sh
sudo apt install -y nodejs
sudo npm i -g nodemon
```
    
#### Building `bazaar` (DataTurk's React frontend)
```
npm install && npm run build-onprem
npm prune #Optional
```

#### Starting the frontend service
```
npm run start-onprem
```

- Now, you should be able to go to [http://localhost:3000](http://localhost:3000) and view the on-prem website.


### Optional Details

#### To build in `debug` mode

Do `export NODE_ENV=development`

Then use the following to build and run the front-end:
```
npm run build-onprem-dev
npm run start-onprem-dev
```

#### Installing `phpMyAdmin` to browse your DB

```
sudo apt install phpmyadmin
sudo service apache2 restart
sudo ln -s /etc/phpmyadmin/apache.conf /etc/apache2/conf-available/phpmyadmin.conf
sudo a2enconf phpmyadmin
sudo service apache2 reload
```

Now you can visit http://localhost/phpmyadmin to access it (Use DB's root username and password to login)

#### Installing SSL (Let's Encrypt)
- Follow this: [Secure Apache with Let's Encrypt](https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-16-04)
- `sudo a2ensite le-redirect-*.conf`

#### Disable firewall
```
sudo ufw disable
sudo iptables -F
```
- Ensure all the ingress/egress ports are open in your computer/VM.
