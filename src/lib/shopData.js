import { uid } from "./utils.js";

// Shop details shown on the printed bill
export const SHOP = {
  name: "Fabrics",
  address: "Main Market, Rahim Yar Khan",
  phone1: "0335677055",
  phone2: "046796881",
};

// Every shop needs a default "walk-in" customer for anonymous sales
export const SEED_CUSTOMERS = [
  { id: uid(), name: "Walk-in Customer", phone: "" },
];