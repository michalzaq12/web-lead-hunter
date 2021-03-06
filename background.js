function makeArrayUnique(array) {
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
     return array.filter(onlyUnique); 
}

function upperCaseFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function parseName(name) {
    if (!name) return '';
    return upperCaseFirstLetter(name.replaceAll(' ', ''));
}


function onLead(lead) {
    if (!lead.emails) return;
    console.log('LEAD', lead);
    lead.emails = makeArrayUnique(lead.emails);
    lead.names = makeArrayUnique(lead.names);
    const subArray = [];
    for (const email of lead.emails) {
        subArray.push({
            name: lead.names && lead.names.length === 1 ? parseName(lead.names[0]) : '',
            email: email,
            title: lead.title
        })
    }
    save(subArray);
}


const DATA_KEY = 'leads';


function save (subArray){
    console.log(subArray);
    // subArray = [{email, url, title}]
    chrome.storage.local.get({[DATA_KEY]: []}, result => {
        const savedData = result[DATA_KEY];
        for (const lead of subArray) {
            if (savedData.find(el => el.email === lead.email)) continue;
            savedData.push(lead);
        }
        chrome.storage.local.set({[DATA_KEY]: savedData});
    });
}

function onData(response) {
    if (!response) return;
    const data = response[0].result;
    console.log('DATA', data);
    const extractEmails = text => text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
    const extractNames = text => text.replaceAll('\n', ' ').match(new RegExp(POLISH_NAMES.join(" | "), "gi"));
    onLead({
        url: data.url,
        title: data.title,
        emails: extractEmails(data.bodyText),
        names: extractNames(data.bodyText)
    })
}


chrome.tabs.onUpdated.addListener((tabId, change, tab) => {

    // Omit empty or chrome specific tabs
    if (!tab.url.startsWith('http')) return;

    // Only scrap data after page load complete event
    if (change.status !== 'complete') return;

    function getData() {
        // USER TAB JS CONTEXT = dont use any functions / vars outside this scope
        return {
            url: document.location.hostname,
            title: document.title,
            bodyText: document.body.innerText
        }
    }

    chrome.scripting.executeScript(
        {
            target: { tabId: tabId },
            function: getData,
        },
        onData
    );



})


// https://gist.github.com/hywak/eccf0c11f7254e9a7c18
const POLISH_NAMES = [
'Arleta',
'Atena',
'Augustyna',
'Aurelia',
'Barbara',
'Beata',
'Bianka',
'Bogna',
'Bogumi??a',
'Bo??ena',
'Brygida',
'Cecylia',
'Celestyna',
'Celina',
'Czes??awa',
'Dagmara',
'Danuta',
'Daria',
'Diana',
'Dominika',
'Dorota',
'D??esika',
'Edyta',
'Eleonora',
'Eliza',
'Elwira',
'El??bieta',
'Emilia',
'Ewa',
'Ewelina',
'Faustyna',
'Felicja',
'Fryderyka',
'Genowefa',
'Gra??yna',
'Halina',
'Hanna',
'Helena',
'Honorata',
'Ida',
'Iga',
'Ilona',
'Inga',
'Irena',
'Iwona',
'Izabela',
'Izolda',
'Jadwiga',
'Jagoda',
'Janina',
'Joanna',
'Jolanta',
'Jowita',
'Judyta',
'Julia',
'Julianna',
'Julita',
'Justyna',
'Juta',
'Kaja',
'Kalina',
'Karina',
'Karolina',
'Katarzyna',
'Kasandra',
'Kinga',
'Klara',
'Klarysa',
'Klaudia',
'Klaudyna',
'Klementyna',
'Kleopatra',
'Konstancja',
'Kordula',
'Kornelia',
'Krystyna',
'Ksawera',
'Ksenia',
'Lana',
'Larysa',
'Laura',
'Lea',
'Lejla',
'Lena',
'Leokadia',
'Leonarda',
'Leoncja',
'Leonora',
'Lidia',
'Ligia',
'Lilia',
'Liliana',
'Linda',
'Liwia',
'Lora',
'Luborada',
'Lucyna',
'Ludmi??a',
'Ludwika',
'Luiza',
'Luna',
'??ucja',
'Magda',
'Magdalena',
'Maja',
'Malwina',
'Ma??gorzata',
'Manuela',
'Marcela',
'Maria',
'Marika',
'Mariola',
'Marlena',
'Marta',
'Martyna',
'Maryja',
'Maryla',
'Maryna',
'Marzena',
'Matylda',
'Melania',
'Michalina',
'Milena',
'Milomira',
'Mi??os??awa',
'Mi??owita',
'Mira',
'Mirabela',
'Miranda',
'Mirela',
'Miriam',
'Mirka',
'Miroda',
'Miro??ada',
'Miros??awa',
'Mojmira',
'Monika',
'Morzana',
'Morzena',
'Nadia',
'Nadzieja',
'Najmi??a',
'Najs??awa',
'Narcyza',
'Natalia',
'Natasza',
'Nela',
'Nika',
'Nikola',
'Nikoleta',
'Nina',
'Nora',
'Norma',
'Oda',
'Odeta',
'Odyla',
'Ofelia',
'Oksana',
'Oktawia',
'Ola',
'Olga',
'Olimpia',
'Oliwia',
'Oriana',
'Ota',
'Otylia',
'O??anna',
'Olena',
'Pamela',
'Patrycja',
'Paula',
'Paulina',
'Pelagia',
'Petra',
'Petronela',
'Petronia',
'Placyda',
'Pola',
'Polmira',
'Przybys??awa',
'Rachela',
'Ramona',
'Radmi??a',
'Rafaela',
'Rajmunda',
'Rajna',
'Raszyda',
'Rebeka',
'Regina',
'Remigia',
'Renata',
'Rita',
'Rodzis??awa',
'Roksana',
'Roma',
'Romualda',
'Rozalia',
'Rozalinda',
'Rozamunda',
'Rozetta',
'Rozwita',
'R????a',
'Rudolfina',
'Ruta',
'Sabina',
'Safira',
'Salma',
'Saloma',
'Salomea',
'Samanta',
'Sandra',
'Sara',
'Selena',
'Selma',
'Serafina',
'S??domira',
'S??dzis??awa',
'S??awa',
'S??awina',
'Sonia',
'Stamira',
'Stefania',
'Stela',
'Stois??awa',
'Stella',
'Sydney',
'Strze??ymira',
'Subis??awa',
'Sulima',
'Sulis??awa',
'Sybilla',
'Sylwana',
'Sylwia',
'Szarlota',
'Szarlin',
'Szarlina',
'Szejma',
'??wietlana',
'??wi??tomira',
'??wi??tos??awa',
'Tabita',
'Tacjana',
'Tadea',
'Tamara',
'Tatiana',
'Tekla',
'Telimena',
'Teodora',
'Teodozja',
'Teresa',
'T??gomira',
'Tina',
'Tolis??awa',
'Tomi??a',
'Tomis??awa',
'Tulimira',
'Ulana',
'Ulryka',
'Uma',
'Una',
'Unima',
'Urszula',
'Uta',
'Walentyna',
'Waleria',
'Wanda',
'Wanessa',
'Wera',
'Weronika',
'Wesna',
'Wiara',
'Wielina',
'Wiera',
'Wierada',
'Wies??awa',
'Wiktoria',
'Wilhelmina',
'Wilma',
'Wincentyna',
'Wioleta',
'Wirgilia',
'Wirginia',
'Wis??awa',
'W??adys??awa',
'W??odzimiera',
'Wolimira',
'Wrocis??awa',
'Zaida',
'Zaira',
'Zdzis??awa',
'Zefiryna',
'Zenobia',
'Zofia',
'Zuzanna',
'Zwinis??awa',
'Zygfryda',
'Zyta',
'??aklina',
'??aneta',
'??anna',
'??elis??awa',
'??u??anna',
'??ywia',
'??ywis??awa',
'Abdon',
'Abel',
'Abelard',
'Abraham',
'Achilles',
'Achmed',
'Adam',
'Adelard',
'Adnan',
'Adrian',
'Agapit',
'Agaton',
'Agrypin',
'Ajdin',
'Albert',
'Albin',
'Albrecht',
'Aleksander',
'Aleksy',
'Alfons',
'Alfred',
'Alojzy',
'Alwin',
'Amadeusz',
'Ambro??y',
'Anastazy',
'Anatol',
'Andrzej',
'Anio??',
'Annasz',
'Antoni',
'Antonin',
'Antonius',
'Anzelm',
'Apollo',
'Apoloniusz',
'Ariel',
'Arkadiusz',
'Arkady',
'Arnold',
'Aron',
'Artur',
'August',
'Augustyn',
'Aurelian',
'Baldwin',
'Baltazar',
'Barabasz',
'Barnim',
'Bart??omiej',
'Bartosz',
'Bazyli',
'Beat',
'Benedykt',
'Beniamin',
'Benon',
'Bernard',
'Bert',
'B??a??ej',
'Bodos??aw',
'Bogda??',
'Bogdan',
'Boguchwa??',
'Bogumi??',
'Bogumir',
'Bogus??aw',
'Bogusz',
'Bolebor',
'Bolelut',
'Boles??aw',
'Bonawentura',
'Bonifacy',
'Borys',
'Borys??aw',
'Borzywoj',
'Bo??an',
'Bo??idar',
'Bo??ydar',
'Bo??imir',
'Bromir',
'Bronis??aw',
'Bruno',
'Brunon',
'Budzis??aw',
'Cecyl',
'Cecylian',
'Celestyn',
'Cezar',
'Cezary',
'Chociemir',
'Chrystian',
'Chwalib??g',
'Chwalimir',
'Chwalis??aw',
'Cichos??aw',
'Cyprian',
'Cyryl',
'Czes??aw',
'Dajmir',
'Dal',
'Dalbor',
'Damazy',
'Damian',
'Daniel',
'Danis??aw',
'Danko',
'Dargomir',
'Dargos??aw',
'Dariusz',
'Darwit',
'Dawid',
'Denis',
'Derwit',
'Dionizy',
'Dobies??aw',
'Dobrogost',
'Dobros??aw',
'Domas??aw',
'Dominik',
'Donald',
'Donat',
'Dorian',
'Duszan',
'Dymitr',
'Dyter',
'D??amil',
'D??an',
'D??em',
'D??emil',
'Edmund',
'Edward',
'Edwin',
'Efrem',
'Eliasz',
'Eligiusz',
'Emanuel',
'Emil',
'Emir',
'Erazm',
'Ernest',
'Erwin',
'Eugeniusz',
'Eryk',
'Ewald',
'Ewaryst',
'Ezaw',
'Ezechiel',
'Fabian',
'Farid',
'Faris',
'Faustyn',
'Felicjan',
'Feliks',
'Ferdynand',
'Filip',
'Florentyn',
'Florian',
'Fortunat',
'Franciszek',
'Fryc',
'Fryderyk',
'Gabriel',
'Gaj',
'Gardomir',
'Gawe??',
'Gerard',
'Gerwazy',
'Gilbert',
'Ginter',
'Gniewomir',
'Godfryg',
'Godfryd',
'Godzis??aw',
'Go??cis??aw',
'Gracjan',
'Grodzis??aw',
'Grzegorz',
'Grzymis??aw',
'Gustaw',
'Gwalbert',
'Gwido',
'Gwidon',
'Hadrian',
'Hamza',
'Hanusz',
'Hasan',
'Hektor',
'Heliodor',
'Henryk',
'Herakles',
'Herbert',
'Herman',
'Hermes',
'Hiacynt',
'Hieronim',
'Hilary',
'Hipolit',
'Honorat',
'Horacy',
'Hubert',
'Hugo',
'Hugon',
'Husajn',
'Idzi',
'Ignacy',
'Igor',
'Ildefons',
'Inocenty',
'Ireneusz',
'Iwan',
'Iwo',
'Iwon',
'Izajasz',
'Izydor',
'Jacek',
'Jacenty',
'Jakub',
'Jan',
'January',
'Janusz',
'Jarad',
'Jaromir',
'Jarope??k',
'Jaros??aw',
'Jarowit',
'Jeremiasz',
'Jerzy',
'J??drzej',
'Joachim',
'Jona',
'Jonasz',
'Jonatan',
'Jozafat',
'J??zef',
'J??zefat',
'Julian',
'Juliusz',
'Jur',
'Juri',
'Justyn',
'Justynian',
'Jasuf',
'Kacper',
'Kain',
'Kajetan',
'Kajfasz',
'Kajusz',
'Kamil',
'Kanimir',
'Karol',
'Kasjusz',
'Kasper',
'Kastor',
'Kazimierz',
'Kemal',
'Kilian',
'Klaudiusz',
'Klemens',
'Kochan',
'Kondrat',
'Konrad',
'Konradyn',
'Konstancjusz',
'Konstanty',
'Konstantyn',
'Kordian',
'Kornel',
'Korneli',
'Korneliusz',
'Kosma',
'Kryspyn',
'Krystian',
'Krystyn',
'Krzesis??aw',
'Krzysztof',
'Ksawery',
'Kwiatos??aw',
'Kwietos??aw',
'Lambert',
'Laurencjusz',
'Lech',
'Lechos??aw',
'Lenart',
'Leo',
'Leon',
'Leokadiusz',
'Leonard',
'Leopold',
'Les??aw',
'Leszek',
'Lew',
'Longin',
'Lubis??aw',
'Lubogost',
'Lubomi??',
'Lubomir',
'Luborad',
'Lubos??aw',
'Lucjan',
'Ludmi??',
'Ludomi??',
'Ludolf',
'Ludomir',
'Ludowit',
'Ludwik',
'??adys??aw',
'??azarz',
'??ucjan',
'??ukasz',
'Maciej',
'Magnus',
'Makary',
'Maksymilian',
'Malachiasz',
'Mamert',
'Manfred',
'Manuel',
'Marcel',
'Marceli',
'Marcin',
'Marcjan',
'Marek',
'Marian',
'Marin',
'Mariusz',
'Maryn',
'Mateusz',
'Maurycjusz',
'Maurycy',
'Maurycjusz',
'Medard',
'Melchior',
'Metody',
'Micha??',
'Mieszko',
'Mieczys??aw',
'Miko??aj',
'Milan',
'Mi??ob??d',
'Mi??ogost',
'Mi??omir',
'Mi??orad',
'Mi??os??aw',
'Mi??owan',
'Mi??owit',
'Mi??osz',
'Mi??owit',
'Mirod',
'Miro??ad',
'Miron',
'Miros??aw',
'Mirosz',
'Modest',
'Mojmierz',
'Mojmir',
'Moj??esz',
'M??ciwoj',
'Muhamed',
'Murat',
'My??limir',
'Napoleon',
'Narcyz',
'Nasif',
'Natan',
'Natanael',
'Nataniel',
'Nestor',
'Nicefor',
'Niecis??aw',
'Nikodem',
'Norbert',
'Norman',
'Odo',
'Odon',
'Oktawian',
'Oktawiusz',
'Olaf',
'Oleg',
'Olgierd',
'Omar',
'Onufry',
'Oskar',
'Orian',
'Otniel',
'Oswald',
'Otokar',
'Otto',
'Otton',
'Owidiusz',
'Pabian',
'Pafnucy',
'Pakos??aw',
'Pankracy',
'Paskal',
'Patrycjusz',
'Patryk',
'Pawe??',
'Pelagiusz',
'Petroniusz',
'Piotr',
'Placyd',
'Polikarp',
'Prokop',
'Prot',
'Protazy',
'Przemys??',
'Przemys??aw',
'Przedpe??k',
'Przybys??aw',
'Radogost',
'Radomi??',
'Radomir',
'Rados??aw',
'Radowit',
'Radzimir',
'Rafa??',
'Rajmund',
'Rajner',
'Remigiusz',
'Renat',
'Robert',
'Roch',
'Roderyk',
'Roger',
'Roland',
'Roman',
'Romeo',
'Romuald',
'Ronald',
'Ros??an',
'Rudolf',
'Rufus',
'Ryszard',
'Salomon',
'Samir',
'Sambor',
'Samson',
'Samuel',
'Sebastian',
'Serafin',
'Sergiusz',
'Serwacy',
'Seweryn',
'S??domir',
'S??dzis??aw',
'Siemowit',
'S??aw',
'S??awek',
'S??awomierz',
'S??awomir',
'Sobies??aw',
'Sofroniusz',
'Stanis??aw',
'Starwit',
'Stefan',
'Stoigniew',
'Stois??aw',
'Stojan',
'Strze??ymir',
'Subis??aw',
'Sulibor',
'Sulis??aw',
'Sykstus',
'Sylwan',
'Sylwester',
'Sylwiusz',
'Symeon',
'Syriusz',
'Szczepan',
'Szymon',
'??cibor',
'??wi??tibor',
'??wi??tomir',
'??wi??tope??k',
'??wi??tos??aw',
'Tadeusz',
'Tarik',
'Telesfor',
'Telimena',
'Teobald',
'Teodor',
'Teodozjusz',
'Teofil',
'T??gomir',
'Tobiasz',
'Tomasz',
'Tomis??aw',
'Tristan',
'Tulimir',
'Tulimierz',
'Tymon',
'Tymoteusz',
'Tytus',
'Urban',
'Ursyn',
'Wac??aw',
'Wahid',
'Waldemar',
'Walenty',
'Walentyn',
'Walerian',
'Walery',
'Walid',
'Walter',
'Wandelin',
'Wawrzyniec',
'Wies??aw',
'Wiktor',
'Wilhelm',
'Wincenty',
'Wirgiliusz',
'Wirginiusz',
'Wis??aw',
'Witold',
'Witos??aw',
'W??adys??aw',
'W??odzimierz',
'W??odzis??aw',
'Wojciech',
'Zachariasz',
'Zbigniew',
'Zdzis??aw',
'Zenon',
'Ziemowit',
'Zygmunt',
]