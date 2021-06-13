# Spring-boot application consuming spotify's API (PKCE OAuth 2.0 Flow)

## [Running Application (Heroku Link)](https://pottify.herokuapp.com/)

##### Spring-boot application consuming spotify's REST API to show user's
* Top played tracks of all time/past 6 months/past month
* Top played artists of all time/past 6 months/past month
* Show recently played tracks
* Saved albums
* Saved tracks
* Newest released tracks
* Featured playlists
* Current playing track
* Searched tracks/playlist/artists

## Tech Stack Used
* Java 15
* Spring Boot 2.5.0
* Spring MVC
* Thymeleaf
* Lombok
* RestTemplate 

## Resources

* [Spotify API Docs](https://developer.spotify.com/documentation/web-api/)
* [Spotify API endpoints Documentation](https://developer.spotify.com/documentation/web-api/reference/)
* [Spotify OAuth flow (PKCE)](https://developer.spotify.com/documentation/general/guides/authorization-guide/)
* [Proof-Key-For-Code Exchange (PKCE) Docs](https://datatracker.ietf.org/doc/html/rfc7636)
* [RestTemplate: Guide](https://www.baeldung.com/rest-template)

## Local Setup

* Install Java 15
* Install Maven

Recommended way is to use [sdkman](https://sdkman.io/) for installing both maven and java

```
sudo su
```

```
sudo apt update
```

```
sudo apt install zip unzip
```

```
curl -s "https://get.sdkman.io" | bash
```

```
source "$HOME/.sdkman/bin/sdkman-init.sh"
```

Install Java 15

```
sdk install java 15.0.1-open
```

Intsall Maven

```
sdk install maven
```

Spotify App Setup 

* Create A New App In Spotify Developers <a href="https://developer.spotify.com/dashboard" target="_blank">Console</a>
* Set Redirect URL to http://localhost:9090/callback
* Copy the client-id generated for the above app along with redirect-uri and configure them in application.properties file

```
com.hardik.pottify.app.client-id=<Client-id here>
com.hardik.pottify.app.redirect-url=<Redirect-URI here>
```


Run the below commands in the core

```
mvn clean install
```

```
mvn spring-boot:run
```

server port is configured to 9090 which can be changed in application.properties file

Go to the below url to view application

```
http://localhost:9090
```

