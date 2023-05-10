# dotreasury

Code for dotreasury.com

# How to Run

## Prerequisite

- Install MongoDB 4.0 or above
- Install Node 15 or above

## How to run Scan package

The scan package is responsible for scanning the blockchain and save treasury-related data to the database, the data will be used by the server package.

```
$ cd packages/scan
$ mv .env.sample .env
$ node src/index.js
```

## How to run Server package

The server package implements a set of RESTful APIs to serve data collected by Scan and provide functionalities like users system, comments, admin, etc...

In packages/server/.env file, you should add the following configurations.

1. Config JWT secret key

```
JWT_SECRET_KEY=xxxxxxxxxxx
```

2. We use the Ali mail service to send email notifications, please config it collectively.

```
ALI_MAIL_KEY=xxx
ALI_MAIL_SECRET=xxx
ALI_MAIL_FROM=xxx
```

3. Config admin user that allowed to edit related links or pin comments

```
ADMINS=your_kusama_address1|your_kusama_address2
```

4. Run service

```
$ cd packages/server
$ node src/index.js
```

## How to run a Site package

The site package is a SPA front-end that consumes data from Server APIs.

In packages/site/.env file, point to your server API URL

```
VITE_APP_SCAN_SERVER=http://localhost:3213/
VITE_APP_SOCKET_IO_URL=http://localhost:3213/
```

Then, run it.

```
$ cd package/site
$ yarn start
```

## License

[Apache 2.0](LICENSE)
