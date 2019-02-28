Using MaterializeCSS: https://materializecss.com/

Using Mongoose: https://mongoosejs.com/

Using handlebars: https://handlebarsjs.com/

# Zagon aplikacije:

0. Git:
    - Prva stvar je seveda nalaganje projekta z Gita
    - Lahko uporabimo kak IDE, Git bash ipd., da iz gita naložimo na naš računalnik

1. Inštalacija:

    - Naloži NodeJS -> https://nodejs.org/en/download/
        - verzija 10.15.1 (npm 6.4.1)
        
    - Naloži mongoDB -> https://www.mongodb.com/download-center/community
         - verzija 4.0.6
         - pri inštalaciji izberemo Install as service
         
         - mongoDB moramo dodati v Environmental Variables na Windowsih (https://dangphongvanthanh.wordpress.com/2017/06/12/add-mongos-bin-folder-to-the-path-environment-variable/)
            - namesto 3.4 moramo mi dati 4.0
    

2. Znotraj mape izvedemo ukaz "npm install"
    - ta naloži vse potrebne module
    
3. Strežnik zaženemo z dvema ukazoma v različnih ukaznih oknih:
    >npm run startDB
        
        - pred tem se mora ustvariti še mapa /database, v kateri bodo potem podatki
        - ta zažene mongoDB strežnik, ki mora teči, preden zaženemo dejansko express aplikacijo
        - instanca mongoDB teče na portu 27017
        
    >npm run startServer
     
        - ta zažene express, ki teče na portu 3000 (localhost:3000)
        
4. Aplikacija na začetku ustvari admina, z uporabniškim geslom in imenom 'admin'
