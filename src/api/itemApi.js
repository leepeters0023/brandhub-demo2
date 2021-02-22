import axios from "axios";
import Jsona from "jsona";

import { buildFilters, handleErrors } from "./apiFunctions";

const dataFormatter = new Jsona();

//Returns items based on filters, see todo above.
export const fetchItems = async (filterObject) => {
  const response = { status: "", error: null, data: null };
  let marketString = filterObject.isOnPremise
    ? "filter[channel]=on_premise"
    : "filter[channel]=retail";
  const queryString = buildFilters(filterObject, marketString, "", "/api/items", "item");
  await axios
    .get(queryString)
    .then((res) => {
      let dataObject = {
        items: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.items = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  const items = [
      {
        brand: "Traeger",
        id: "1",
        itemDescription: 'Modular 72" Grill Backer.  Interchangeable Graphic panels',
        estCost: 555,
        packSize: 1,
        itemType: "Large Grill Fence",
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_LargeGrillFence_2_v0orgr.jpg",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_LargeGrillFence_2_v0orgr.jpg","https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_LargeGrillFence_2_v0orgr.jpg","https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_LargeGrillFence_2_v0orgr.jpg"],
        program: "Lowes USA", 
        focusMonth: "Q4 Retail",
        programLogo: "https://logodix.com/logo/942512.jpg",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624035/Select/20_lusezy.jpg",
      },
      {
        brand: "Traeger",
        id: "2",
        itemDescription: "Modular panels for various product assortments.",
        estCost: 555,
        packSize: 5,
        itemType: "Cleaning Product Display",
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716035/Select/Traeger_CleaningProductsDisplay_eoglpu.jpg",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716035/Select/Traeger_CleaningProductsDisplay_eoglpu.jpg","https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716035/Select/Traeger_CleaningProductsDisplay_eoglpu.jpg","https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716035/Select/Traeger_CleaningProductsDisplay_eoglpu.jpg"],
        program: "Ace Hardware", 
        focusMonth: "Holiday Retail",
        programLogo: "https://images05.military.com/sites/default/files/2019-03/ACE-VTP-Logo-1200x800.jpg",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624034/Select/7_tllfj2.jpg",
      },
      {
        brand: "Traeger",
        id: "3",
        itemDescription: "Stackable, modular panels for various product assortments.",
        estCost: 555,
        packSize: 1,
        itemType: "Shelf Drop Tray Display",
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_ShelfDripTrayDisplay_xpdb9b.jpg",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_ShelfDripTrayDisplay_xpdb9b.jpg","https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_ShelfDripTrayDisplay_xpdb9b.jpg","https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_ShelfDripTrayDisplay_xpdb9b.jpg"],
        program: "Lowes Canada", 
        focusMonth: "Q4 Retail",
        programLogo: "https://logodix.com/logo/942512.jpg",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/6_kcowc7.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Sauce Rub Fixture",
        id: "4",
        packSize: 1,
        itemDescription: "2Bay pellet fixture attachment.  Holds 45 sauces, 65 Rubs.",
        estCost: 555,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_SauceRubFixture_pphgyn.jpg",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_SauceRubFixture_pphgyn.jpg","https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_SauceRubFixture_pphgyn.jpg","https://res.cloudinary.com/joshdowns-dev/image/upload/v1603716034/Select/Traeger_SauceRubFixture_pphgyn.jpg"],
        program: "Home Depot", 
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Double Sided Sign 1",
        id: "4",
        itemDescription: "13' collapsible Flag with stand.  Kit of 2",
        estCost: 555,
        packSize: 2,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Double_Sided_Flag_Option1_xv2meo.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Double_Sided_Flag_Option1_xv2meo.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Double_Sided_Flag_Option1_xv2meo.png", "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Double_Sided_Flag_Option1_xv2meo.png"],
        program: "Home Depot",
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Double Sided Sign 2",
        id: "4",
        itemDescription: "13' collapsible Flag with stand.  Kit of 1",
        estCost: 555,
        packSize: 1,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/113860_Double_Sided_Flag_Option2_vzdeoh.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/113860_Double_Sided_Flag_Option2_vzdeoh.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/113860_Double_Sided_Flag_Option2_vzdeoh.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/113860_Double_Sided_Flag_Option2_vzdeoh.png",],
        program: "Home Depot", 
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Table Cover 1",
        id: "4",
        itemDescription: "Fire resistant demo table cover.",
        estCost: 555,
        packSize: 6,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/115452_6__Table_Cover_ksqncq.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/115452_6__Table_Cover_ksqncq.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/115452_6__Table_Cover_ksqncq.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/115452_6__Table_Cover_ksqncq.png",],
        program: "Home Depot",
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Table Cover 2",
        id: "4",
        itemDescription: "Fire resistant demo table cover.",
        estCost: 555,
        packSize: 6,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/117328_4__Table_Cover_dqnncf.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/117328_4__Table_Cover_dqnncf.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/117328_4__Table_Cover_dqnncf.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/117328_4__Table_Cover_dqnncf.png",],
        program: "Home Depot", 
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Sticker 1",
        id: "4",
        itemDescription: '3" diameter removable decal.',
        estCost: 555,
        packSize: 150,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Original_Traeger_Sticker_ogyjha.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Original_Traeger_Sticker_ogyjha.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Original_Traeger_Sticker_ogyjha.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Original_Traeger_Sticker_ogyjha.png",],
        program: "Home Depot", 
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Sticker 2",
        id: "4",
        itemDescription: '3" diameter removable decal.',
        estCost: 555,
        packSize: 150,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_I_d_Smoke_That_Sticker_prtn8m.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_I_d_Smoke_That_Sticker_prtn8m.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_I_d_Smoke_That_Sticker_prtn8m.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_I_d_Smoke_That_Sticker_prtn8m.png",],
        program: "Home Depot",
        focusMonth: "Fall Experience", 
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Metal Sign",
        id: "4",
        itemDescription: "Tin tacker with 4 holes for mounting or hanging.",
        estCost: 555,
        packSize: 5,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/118092_Metal_Sign_jchxze.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/118092_Metal_Sign_jchxze.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/118092_Metal_Sign_jchxze.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/118092_Metal_Sign_jchxze.png",],
        program: "Home Depot", 
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Pint",
        id: "4",
        itemDescription: "12 oz plastic reuseable cup.",
        estCost: 555,
        packSize: 50,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Pint_elmnyq.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Pint_elmnyq.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Pint_elmnyq.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114222_Pint_elmnyq.png",],
        program: "Home Depot",
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png", 
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Cap",
        id: "4",
        itemDescription: "Adjustable, one size fits all trucker with patch",
        estCost: 555,
        packSize: 12,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114933_Cap_qzpr0d.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114933_Cap_qzpr0d.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114933_Cap_qzpr0d.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631968/Select/114933_Cap_qzpr0d.png",],
        program: "Home Depot", 
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Tent",
        id: "4",
        itemDescription: "Folding demo tent. Includes sand bags and carry bag.",
        estCost: 555,
        packSize: 1,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Tent_mtek5j.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Tent_mtek5j.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Tent_mtek5j.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/113860_Tent_mtek5j.png",],
        program: "Home Depot", 
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Tee 1",
        id: "4",
        itemDescription: "100% cotton fitted tee.",
        estCost: 555,
        packSize: 5,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_Traeger_Circle_Tee_skiuie.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_Traeger_Circle_Tee_skiuie.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_Traeger_Circle_Tee_skiuie.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631969/Select/114222_Traeger_Circle_Tee_skiuie.png",],
        program: "Home Depot",
        focusMonth: "Fall Experience", 
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
      {
        brand: "Traeger",
        itemType: "Tee 2",
        id: "4",
        itemDescription: "100% cotton fitted tee.",
        estCost: 555,
        packSize: 5,
        imgUrl: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631970/Select/115778_Tee_mugany.png",
        carouselImgs: ["https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631970/Select/115778_Tee_mugany.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631970/Select/115778_Tee_mugany.png","https://res.cloudinary.com/joshdowns-dev/image/upload/v1605631970/Select/115778_Tee_mugany.png",],
        program: "Home Depot", 
        focusMonth: "Fall Experience",
        programLogo: "https://1000logos.net/wp-content/uploads/2017/02/Home-Depot-Logo.png",
        oneSheetImg: "https://res.cloudinary.com/joshdowns-dev/image/upload/v1605624033/Select/4_x6r6uj.jpg",
      },
  ]
  return response;
};

export const fetchNextItems = async (url) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(url)
    .then((res) => {
      let dataObject = {
        items: null,
        nextLink: null,
      };
      let data = dataFormatter.deserialize(res.data);
      dataObject.items = data;
      dataObject.nextLink = res.data.links.next ? res.data.links.next : null;
      response.status = "ok";
      response.data = dataObject;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

//Returns item types and returns an array of all available item types
export const fetchItemTypes = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/item-types")
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchSharedItems = async (ids) => {
  const response = { status: "", error: null, data: null };
  await axios
    .get(`/api/items?filter[ids]=${ids}`)
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};

export const fetchBusinessUnits = async () => {
  const response = { status: "", error: null, data: null };
  await axios
    .get("/api/business-units")
    .then((res) => {
      let data = dataFormatter.deserialize(res.data);
      response.status = "ok";
      response.data = data;
    })
    .catch((err) => {
      const error = handleErrors(err);
      console.log(error);
      response.status = "error";
      response.error = error;
    });
  return response;
};
