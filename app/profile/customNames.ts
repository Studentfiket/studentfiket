import { User } from '@/lib/types';

const generateSvenGard = () => {
  const gard = ['Svärd', 'Värd', 'Lärd', "Närd", "Färd", "Härd", "Märd", "Pärd", "Tärd", "Ärd", "Örd", "Ård", "Ürd", "Ærd", "Ø"];
  const randomIndex = Math.floor(Math.random() * gard.length);
  return "Sven " + gard[randomIndex];
}

const customNames: { [key: string]: string | (() => string) } = {
  'albkj604': "Abbe K",
  // MAFFIAN
  'vicst918': "Victor auf Strömmen",
  'emial133': "Lord Kurtinator",
  'ellbe420': "BINGSTRÖM",
  'jossp703': "Jossan Maggan Spångan",
  'sofwa005': "Tayla Schwift",
  'guskr150': "Ginkus 'KG' Kronholm",
  'oscfy612': "Borren 'Maskinen' Fyrk",
  'moyhj795': "Muuuuu Mjölkfrid",
  'alipa233': "Pelle ”Pelle” Pälverinne",

  // SKURKERIET
  'johda474': "Captain Jill S. Creu",
  'alvsu234': "Bree C. Zeyl",
  'emmah230': "Connie Trast Valoo",
  'frian635': "Maddy Cash",
  'joehe737': "Jaques Poirot aka. Webmaister",
  'leome651': "Sir Von D. Fleet",
  'linlo121': "Sav Y. May Thea",
  'annso699': "Wendy Ceglith",
  'maxsa485': "Lincoln Bayou",
  'teohe874': "Noa R. Steass",
  'arvma857': "T. Rolph Ace",

  'armab790': "123ArmenAbedi 456GimmeAKiss",
  'svega741': generateSvenGard,
  'ottli370': "Stuvsta!"
};

export function getCustomName(user: User): string {
  console.log(user);
  const customName = customNames[user.username];
  if (typeof customName === 'function') {
    return customName();
  }
  return customName || user.name;
}
