import contacts from "./contacts";
import cooperationModelCard from "./cooperationModelCard";
import expansionBand from "./expansionBand";
import hero from "./hero";
import lead from "./lead";
import { localeString, localeText } from "./localeField";
import navigation from "./navigation";
import operatorBaseCard from "./operatorBaseCard";
import property from "./property";
import restaurantsFootnote from "./restaurantsFootnote";
import statList from "./statList";

export const schemaTypes = [
  localeString,
  localeText,
  hero,
  statList,
  restaurantsFootnote,
  contacts,
  expansionBand,
  navigation,
  property,
  cooperationModelCard,
  operatorBaseCard,
  lead,
];
