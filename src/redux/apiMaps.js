import { stringToCents, formatDate } from "../utility/utilityFunctions";
import { brandLogoMap } from "../utility/constants";
import addDays from "date-fns/addDays";
import getYear from "date-fns/getYear";
import format from "date-fns/format";

/*
Functions used to ensure data coming from api always matches
formats defined within the UI
*/
const orderTypeMap = {
  "pre-order": "Pre Order",
  "in-stock": "In Stock",
  "on-demand": "On Demand",
};

const monthMap = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  10: "October",
  11: "November",
  12: "December",
};

const typeMap = {
  "prior-approval": "Prior Approval",
  "coupon-prior-approval": "Coupon Prior Approval",
  "internal-approval": "Internal Approval",
  price: "Price",
  "item-type": "Item Type",
  material: "Material",
  "metal-wood": "Metal / Wood",
  "coupon-offer-type": "Coupon Offer Type",
  "coupon-item-type": "Coupon Item Type",
  "coupon-face-value": "Coupon Face Value",
};

const handleImages = (images) => {
  if (images.length === 0) {
    return {
      imgUrlThumb:
        "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
      imgUrlLg: [
        "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
      ],
    };
  } else {
    let thumb = images.find((img) => img.type === "thumbnail");
    if (!thumb) {
      thumb = images[1] ? images[1] : images[0];
    }
    let largeArray = images
      .filter((img) => img.type === "large")
      .sort((a, b) => {
        return a.position < b.position ? -1 : a.position > b.position ? 1 : 0;
      })
      .map(
        (i) =>
          `https://res.cloudinary.com/brandhub/image/upload/${i["cloudinary-id"]}`
      );
    if (largeArray.length === 0) {
      largeArray = [
        "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
      ];
    }
    return {
      imgUrlThumb: thumb
        ? `https://res.cloudinary.com/brandhub/image/upload/${thumb["cloudinary-id"]}`
        : "https://res.cloudinary.com/joshdowns-dev/image/upload/v1607091694/Select/NotFound_v0kyue.png",
      imgUrlLg: largeArray,
    };
  }
};

export const mapItems = (items) => {
  const sortPrograms = (programs) => {
    if (programs.length === 1) {
      return [programs[0]];
    } else {
      let sortedPrograms = programs
        .sort((a, b) => {
          return new Date(a["start-date"]) - new Date(b["start-date"]);
        })
        .reverse();
      let currentProgram = sortedPrograms.find(
        (prog) =>
          new Date(prog["order-calendar-month"]["order-window-open-date"]) <=
            new Date() &&
          new Date() <=
            new Date(prog["order-calendar-month"]["order-window-close-date"])
      );
      if (currentProgram) {
        sortedPrograms.sort((a, b) =>
          a.id === currentProgram.id ? -1 : b.id === currentProgram.id ? 1 : 0
        );
      }
      return sortedPrograms;
    }
  };

  let mappedItems = items.map((item) => {
    const images = handleImages(item.images);
    const itemPrograms =
      item.programs && item.programs.length > 0
        ? sortPrograms(item.programs)
        : "---";
    return {
      id: item.id,
      itemNumber: item["item-number"],
      brand:
        item.brands.length > 0 ? item.brands.map((brand) => brand.name) : "---",
      program:
        itemPrograms !== "---" ? itemPrograms.map((prog) => prog.name) : "---",
      programIds:
        item.programs && item.programs.length > 0
          ? item.programs.map((prog) => prog.id)
          : null,
      itemType: item.type,
      projectNum: item["at-task-project-id"]
        ? item["at-task-project-id"]
        : "---",
      specification: item.specification
        ? mapSpecifications(item.specification)
        : "---",
      itemDescription: item.comment ? item.comment : "---",
      estCost: stringToCents(item["estimated-cost"]),
      packSize: item["qty-per-pack"],
      stock: item["cached-warehouse-qty"]
        ? item["cached-warehouse-qty"]
        : "---",
      orderStartDate: item["orderable-start-date"]
        ? format(
            formatDate(new Date(item["orderable-start-date"])),
            "MM/dd/yyyy"
          )
        : "---",
      orderEndDate: item["orderable-end-date"]
        ? format(formatDate(new Date(item["orderable-end-date"])), "MM/dd/yyyy")
        : "---",
      inMarketDate:
        itemPrograms !== "---"
          ? format(
              formatDate(new Date(itemPrograms[0]["start-date"])),
              "MM/dd/yyyy"
            )
          : "---",
      warehouse: item.warehouse,
      supplierId: item.supplier.id,
      isCoupon: item["is-coupon"],
      couponInfo: item["coupon-custom-raw-payload"]
        ? {
            startDate: format(
              formatDate(
                new Date(item["coupon-custom-raw-payload"].CouponStartDate)
              ),
              "MM/dd/yyyy"
            ),
            expirationDate: format(
              formatDate(
                new Date(item["coupon-custom-raw-payload"].CouponExpirationDate)
              ),
              "MM/dd/yyyy"
            ),
            typeCode: item["coupon-custom-raw-payload"].CouponTypeCode,
            offerType: item["coupon-custom-raw-payload"].CouponOfferTypeCode,
            description:
              item["coupon-custom-raw-payload"].CouponOfferDescription,
            bottles: item["coupon-custom-raw-payload"].Quantity,
            bottleDiscount:
              item["coupon-custom-raw-payload"].CouponFaceValue * 100,
          }
        : null,
      couponStartDate: item["coupon-issue_date"]
        ? format(formatDate(new Date(item["coupon-issue-date"])), "MM/dd/yyyy")
        : null,
      couponExpirationDate: item["coupon-expiration-date"]
        ? format(
            formatDate(new Date(item["coupon-expiration-date"])),
            "MM/dd/yyyy"
          )
        : null,
      couponOfferType: item["coupon-offer-type-code"]
        ? item["coupon-offer-type-code"]
        : null,
      couponOfferDescription: item["coupon-offer-description"]
        ? item.item["coupon-offer-description"]
        : null,
      couponTypeCode: item["coupon-type-code"]
        ? item["coupon-type-code"]
        : null,
      imgUrlThumb: images.imgUrlThumb,
      imgUrlLg: images.imgUrlLg,
    };
  });
  return mappedItems;
};

export const mapSpecifications = (specs) => {
  const mappedSpecs = Object.keys(specs).map((keyName) => {
    return {
      key: keyName,
      value: specs[keyName].length > 1 ? specs[keyName] : "N/A",
    };
  });
  return mappedSpecs;
};

export const mapOrderSetItems = (items) => {
  let mappedItems = items.map((item) => ({
    user: item["user-name"],
    itemNumber: item["sequence-number"],
    brand: item.program
      ? item.program.brands.map((brand) => brand.name)
      : "---",
    program: item["program-name"],
    itemType: item["item-type-description"],
    itemDescription: item.comment ? item.comment : "---",
    state: item["state-names"] ? item["state-names"] : "---",
    packSize: item["qty-per-pack"],
    totalItems: item["total-item-qty"],
    estCost: stringToCents(item["estimated-cost"]),
    totalEstCost: stringToCents(item["total-estimated-cost"]),
    orderDate: item["order-set-submitted-at"]
      ? item["order-set-submitted-at"]
      : "---",
    orderDue: item.program
      ? item.program["order-calendar-month"]["order-window-close-date"]
      : "---",
    inMarketDate: item.program
      ? item.program["order-calendar-month"]["in-market-start-date"]
      : "---",
    status: item["order-set-status"],
    orderSetId: item["order-set"].id,
  }));
  return mappedItems;
};

export const mapPrograms = (programs) => {
  let programArray = programs.map((prog) => ({
    id: prog.id,
    type: prog.type,
    name: prog.name ? prog.name : "---",
    brand:
      prog.brands.length > 0
        ? prog.brands.map((brand) => brand.name)
        : ["BRAND"],
    unit: prog["business-unit-names"][0],
    desc:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec fringilla arcu vitae nunc rhoncus, condimentum auctor tellus ullamcorper. Nullam felis enim, hendrerit nec egestas non, convallis quis orci. Ut non maximus risus, in tempus felis. Morbi euismod blandit bibendum. Suspendisse pulvinar elit porta imperdiet porta. Pellentesque eu rhoncus lectus. Morbi ultrices molestie nisi id ultrices.",
    goals: prog.goals,
    strategies: prog.strategies,
    startDate: prog["start-date"],
    endDate: prog["end-date"],
    orderWindow: prog["order-calendar-month"]["order-window-name"],
    inMarketDate: format(
      formatDate(
        new Date(prog["order-calendar-month"]["in-market-start-date"])
      ),
      "MM/dd/yyyy"
    ),
    orderWindowOpen: format(
      formatDate(
        new Date(prog["order-calendar-month"]["order-window-open-date"])
      ),
      "MM/dd/yyyy"
    ),
    orderWindowClose: format(
      formatDate(
        new Date(prog["order-calendar-month"]["order-window-close-date"])
      ),
      "MM/dd/yyyy"
    ),
    focusMonth: monthMap[prog["start-date"].split("-")[1]],
    imgUrl:
      prog.brands.length === 1
        ? brandLogoMap[prog.brands[0].name]
        : "https://res.cloudinary.com/brandhub/image/upload/v1612303566/prod/BrandLogos/Logo_EJG_Crest_uatj0x.png",
    items: [],
    isItemsFetched: false,
    status: false,
  }));
  programArray.sort((a, b) => {
    return a.name.toLowerCase()[0] < b.name.toLowerCase()[0]
      ? -1
      : a.name.toLowerCase()[0] > b.name.toLowerCase()[0]
      ? 1
      : 0;
  });
  programArray = programArray.filter((prog) => prog.brand[0] !== "BRAND");
  return programArray;
};

export const mapSingleOrder = (order) => {
  let orderItems = mapOrderItems(order["order-items"], "history");
  orderItems.filter((item) => item.actShipDate);
  let formattedOrder = {
    id: order.id,
    user: order.user.name,
    distId: order.distributor ? order.distributor.id : null,
    distributorId: order.distributor
      ? order.distributor["external-source-id"]
      : null,
    distributorName: order.distributor ? order.distributor.name : null,
    distributorCity: order.distributor ? order.distributor.city : null,
    distributorState: order.distributor ? order.distributor.state : null,
    distributorCountry: order.distributor ? order.distributor.country : null,
    distributorAddressOne: order.distributor
      ? order.distributor["street-address-1"]
      : null,
    distributorAddressTwo: order.distributor
      ? order.distributor["street-address-2"]
      : null,
    distributorZip: order.distributor ? order.distributor.zip : null,
    customAddressId: order["custom-address"]
      ? order["custom-address"].id
      : null,
    customAddressName: order["custom-address"]
      ? order["custom-address"].name
      : null,
    customAddressCity: order["custom-address"]
      ? order["custom-address"].city
      : null,
    customAddressState: order["custom-address"]
      ? order["custom-address"].state.code
      : null,
    customAddressCountry: order["custom-address"]
      ? order["custom-address"].country
      : null,
    customAddressAddressOne: order["custom-address"]
      ? order["custom-address"]["street-address-1"]
      : null,
    customAddressAddressTwo: order["custom-address"]
      ? order["custom-address"]["street-address-2"]
      : null,
    customAddressZip: order["custom-address"]
      ? order["custom-address"].zip
      : null,
    program:
      order["program-names"] && order["program-names"].length > 0
        ? order["program-names"].join(", ")
        : "---",
    type: orderTypeMap[order.type],
    brand: [
      ...new Set(
        [].concat.apply(
          [],
          order["order-items"].map((item) =>
            item.item.brands.map((brand) => brand.name)
          )
        )
      ),
    ],
    items: orderItems,
    status: order.status === "submitted" ? "Pending" : order.status,
    orderDate: order["submitted-at"] ? order["submitted-at"] : "---",
    approvedDate: order["approved-at"] ? order["approved-at"] : "---",
    shipDate:
      orderItems.filter((item) => item.actShipDate).length > 0
        ? orderItems.filter((item) => item.actShipDate).join(", ")
        : "---",
    trackingNum: order["tracking-number"] ? order["tracking-number"] : "---",
    totalItems: order["total-quantity"],
    totalEstFreight: order["total-estimated-shipping-cost"]
      ? stringToCents(order["total-estimated-shipping-cost"])
      : "---",
    totalActFreight:
      order["total-actual-shipping-cost"] &&
      stringToCents(order["total-actual-shipping-cost"]) !== 0
        ? stringToCents(order["total-actual-shipping-cost"])
        : "---",
    totalEstTax: order["total-estimated-tax"]
      ? stringToCents(order["total-estimated-tax"])
      : "---",
    totalActTax: order["total-actual-tax"]
      ? stringToCents(order["total-actual-tax"])
      : "---",
    totalEstCost: stringToCents(order["total-estimated-cost"]),
    totalActCost:
      orderItems.filter((item) => item.totalActCost === 0).length > 0
        ? "---"
        : stringToCents(order["total-actual-cost"]),
    note: order.notes ? order.notes : "---",
    attn: order.attn ? order.attn : "---",
  };
  return formattedOrder;
};

export const mapOrderHistoryOrders = (orders) => {
  let mappedOrders = orders.map((order) => {
    let formattedOrder = mapSingleOrder(order);
    return formattedOrder;
  });
  return mappedOrders;
};

export const mapOrderHistoryItems = (items) => {
  let mappedItems = items.map((item) => {
    const images = handleImages(item.item.images);
    return {
      id: item.id,
      itemNumber: item["item-number"],
      imgUrlThumb: images.imgUrlThumb,
      imgUrlLg: images.imgUrlLg,
      orderType: item["order-type"],
      orderNumber: item.order.id,
      specification: item.item.specification
        ? mapSpecifications(item.item.specification)
        : "---",
      brand: item.item.brands.map((brand) => brand.name),
      brandCode: item.item.brands
        .map((brand) => brand["external-id"])
        .join(", "),
      program: item["program-names"].join(", "),
      itemType: item["item-type-description"],
      itemTypeCode: item["item-type-external-id"]
        ? item["item-type-external-id"]
        : "---",
      itemDescription: item.item.comment ? item.item.comment : "---",
      unit: [
        ...new Set(
          item.item.brands.map((brand) => brand["business-unit"].name)
        ),
      ].join(", "),
      distributor:
        item["distributor-name"].length > 0
          ? item["distributor-name"]
          : item["custom-address-name"].length > 0
          ? item["custom-address-name"]
          : "---",
      distributorAbn: item["distributor-external-id"]
        ? item["distributor-external-id"]
        : "---",
      addressOne: item["street-address-1"],
      addressTwo: item["street-address-2"],
      city: item.city,
      state: item.state ? item.state : "---",
      zip: item.zip,
      supplierId: item.item.supplier.id,
      territoryType: item["territory-type"] ? item["territory-type"] : "---",
      territoryName: item["territory-name"] ? item["territory-name"] : "---",
      packSize: item["qty-per-pack"],
      totalItems: item.qty,
      estCost: stringToCents(item["estimated-cost"]),
      totalEstCost: stringToCents(item["total-estimated-cost"]),
      actCost: item["total-actual-cost"]
        ? stringToCents(item["total-actual-cost"]) / item.qty
        : "---",
      totalActCost: item["total-actual-cost"]
        ? stringToCents(item["total-actual-cost"])
        : "---",
      orderDate: format(
        formatDate(new Date(item["order-submitted-at"])),
        "MM/dd/yyyy"
      ),
      shipDate:
        item["shipping-parameter-item"] &&
        item["shipping-parameter-item"]["actual-ship-date"]
          ? format(
              formatDate(
                new Date(item["shipping-parameter-item"]["actual-ship-date"])
              ),
              "MM/dd/yyyy"
            )
          : "---",
      carrier:
        item["shipping-parameter-item"] &&
        item["shipping-parameter-item"].carrier
          ? item["shipping-parameter-item"].carrier
          : "---",
      tracking:
        item["shipping-parameter-item"] &&
        item["shipping-parameter-item"]["tracking-number"]
          ? item["shipping-parameter-item"]["tracking-number"]
          : "---",
      trackingId:
        item["shipping-parameter-item"] && item["shipping-parameter-item"].id
          ? item["shipping-parameter-item"].id
          : null,
      status: item["order-status"],
      user: item["order-user-name"],
      orderStartDate: item.item["orderable-start-date"]
        ? format(
            formatDate(new Date(item.item["orderable-start-date"])),
            "MM/dd/yyyy"
          )
        : "---",
      orderEndDate: item.item["orderable-end-date"]
        ? format(
            formatDate(new Date(item.item["orderable-end-date"])),
            "MM/dd/yyyy"
          )
        : "---",
      inMarketDate: item["in-market-date"]
        ? format(formatDate(new Date(item["in-market-date"])), "MM/dd/yyyy")
        : "---",
      triggeredRules: item["triggered-rules"]
        ? item["triggered-rules"].map((rule) => rule.rule.description)
        : null,
      triggeredPriorApprovalRules: item["prior-approval-triggered-rules"]
        ? item["prior-approval-triggered-rules"].map(
            (rule) => rule.rule.description
          )
        : null,
      isComplianceCanceled: item["is-compliance-canceled"],
      orderId: item.order.id,
      isCoupon: item.item["is-coupon"],
      couponInfo: item.item["coupon-custom-raw-payload"]
        ? {
            startDate: format(
              formatDate(
                new Date(item.item["coupon-custom-raw-payload"].CouponStartDate)
              ),
              "MM/dd/yyyy"
            ),
            expirationDate: format(
              formatDate(
                new Date(
                  item.item["coupon-custom-raw-payload"].CouponExpirationDate
                )
              ),
              "MM/dd/yyyy"
            ),
            typeCode: item.item["coupon-custom-raw-payload"].CouponTypeCode,
            offerType:
              item.item["coupon-custom-raw-payload"].CouponOfferTypeCode,
            description:
              item.item["coupon-custom-raw-payload"].CouponOfferDescription,
            bottles: item.item["coupon-custom-raw-payload"].Quantity,
            bottleDiscount:
              item.item["coupon-custom-raw-payload"].CouponFaceValue * 100,
          }
        : null,
      couponStartDate: item.item["coupon-issue_date"]
        ? format(
            formatDate(new Date(item.item["coupon-issue-date"])),
            "MM/dd/yyyy"
          )
        : null,
      couponExpirationDate: item.item["coupon-expiration-date"]
        ? format(
            formatDate(new Date(item.item["coupon-expiration-date"])),
            "MM/dd/yyyy"
          )
        : null,
      couponOfferType: item.item["coupon-offer-type-code"]
        ? item.item["coupon-offer-type-code"]
        : null,
      couponOfferDescription: item.item["coupon-offer-description"]
        ? item.item["coupon-offer-description"]
        : null,
      couponTypeCode: item.item["coupon-type-code"]
        ? item.item["coupon-type-code"]
        : null,
    };
  });
  return mappedItems;
};

export const mapOrderItems = (items, type) => {
  let mappedItems = items
    .map((item) => {
      const images = handleImages(item.item.images);
      return {
        id: item.id,
        itemId: item.item.id,
        itemNumber: item.item["item-number"],
        imgUrlThumb: images.imgUrlThumb,
        imgUrlLg: images.imgUrlLg,
        brand:
          item.item.brands.length > 0
            ? item.item.brands.map((brand) => brand.name).join(", ")
            : "---",
        specification: item.item.specification
          ? mapSpecifications(item.item.specification)
          : "---",
        brandCode: item.item.brands
          .map((brand) => brand["external-id"])
          .join(", "),
        program: item["program-names"]
          ? item["program-names"].join(", ")
          : item.item.programs.map((prog) => prog.name).join(", "),
        itemType: item.item.type,
        itemDescription: item.item.comment ? item.item.comment : "---",
        unit:
          item.item.brands.length > 0
            ? [
                ...new Set(
                  item.item.brands.map((brand) => brand["business-unit"].name)
                ),
              ].join(", ")
            : "---",
        packSize: item.item["qty-per-pack"],
        leadTime: item.item["lead-time-in-days"],
        supplierId: item.item.supplier.id,
        state:
          type === "order-set-item"
            ? "---"
            : item.order.distributor
            ? item.order.distributor.state
            : item.order["custom-address"].state.code,
        estCost: stringToCents(item.item["estimated-cost"]),
        totalItems: type === "order-set-item" ? 0 : item.qty,
        totalEstShipping:
          type === "order-set-item"
            ? null
            : stringToCents(item["total-estimated-shipping-cost"]),
        totalEstTax:
          type === "order-set-item"
            ? null
            : stringToCents(item["total-estimated-tax"]),
        totalEstCost:
          type === "order-set-item"
            ? 0
            : stringToCents(item["total-estimated-cost"]),
        totalActCost: stringToCents(item["total-actual-cost"]),
        complianceStatus:
          type !== "order-set-item" &&
          item["triggered-rules"].length > 0 &&
          item["triggered-rules"].filter(
            (rule) =>
              rule.type === "item-type" ||
              rule.type === "metal-wood" ||
              rule.type === "coupon-item-type" ||
              rule.type === "coupon-offer-type" ||
              rule.type === "coupon-face-vale"
          ).length > 0
            ? "not-compliant"
            : "compliant",
        priorApprovalDenied:
          type !== "order-set-item" && item["prior-approval-denied"]
            ? item["prior-approval-denied"]
            : false,
        isComplianceCanceled: item["is-compliance-canceled"],
        orderType: item["order-type"],
        orderStartDate: item.item["orderable-start-date"]
          ? format(
              formatDate(new Date(item.item["orderable-start-date"])),
              "MM/dd/yyyy"
            )
          : "---",
        orderEndDate: item.item["orderable-end-date"]
          ? format(
              formatDate(new Date(item.item["orderable-end-date"])),
              "MM/dd/yyyy"
            )
          : "---",
        standardDeliveryDate: item["standard-delivery-date"]
          ? item["standard-delivery-date"]
          : "---",
        inMarketDate: item["in-market-date"] ? item["in-market-date"] : "---",
        isRush: item["is-rush"] ? item["is-rush"] : false,
        actShipDate:
          item["shipping-parameter-item"] &&
          item["shipping-parameter-item"]["actual-ship-date"]
            ? item["shipping-parameter-item"]["actual-ship-date"]
            : null,
        carrier:
          item["shipping-parameter-item"] &&
          item["shipping-parameter-item"].carrier
            ? item["shipping-parameter-item"].carrier
            : "---",
        tracking: item["shipping-parameter-item"]
          ? item["shipping-parameter-item"]["tracking-number"]
            ? item["shipping-parameter-item"]["tracking-number"]
            : "---"
          : "---",
        trackingId: item["shipping-parameter-item"]
          ? item["shipping-parameter-item"].id
            ? item["shipping-parameter-item"].id
            : null
          : null,
        onShipHold: item["shipping-parameter-item"]
          ? item["shipping-parameter-item"]["compliance-status"] ===
              "prior-approval-pending" ||
            item["shipping-parameter-item"]["compliance-status"] === "denied"
          : "---",
        isCoupon: item.item["is-coupon"],
        couponInfo: item.item["coupon-custom-raw-payload"]
          ? {
              startDate: format(
                formatDate(
                  new Date(
                    item.item["coupon-custom-raw-payload"].CouponStartDate
                  )
                ),
                "MM/dd/yyyy"
              ),
              expirationDate: format(
                formatDate(
                  new Date(
                    item.item["coupon-custom-raw-payload"].CouponExpirationDate
                  )
                ),
                "MM/dd/yyyy"
              ),
              typeCode: item.item["coupon-custom-raw-payload"].CouponTypeCode,
              offerType:
                item.item["coupon-custom-raw-payload"].CouponOfferTypeCode,
              description:
                item.item["coupon-custom-raw-payload"].CouponOfferDescription,
              bottles: item.item["coupon-custom-raw-payload"].Quantity,
              bottleDiscount:
                item.item["coupon-custom-raw-payload"].CouponFaceValue * 100,
            }
          : null,
        couponStartDate: item.item["coupon-issue_date"]
          ? format(
              formatDate(new Date(item.item["coupon-issue-date"])),
              "MM/dd/yyyy"
            )
          : null,
        couponExpirationDate: item.item["coupon-expiration-date"]
          ? format(
              formatDate(new Date(item.item["coupon-expiration-date"])),
              "MM/dd/yyyy"
            )
          : null,
        couponOfferType: item.item["coupon-offer-type-code"]
          ? item.item["coupon-offer-type-code"]
          : null,
        couponOfferDescription: item.item["coupon-offer-description"]
          ? item.item["coupon-offer-description"]
          : null,
        couponTypeCode: item.item["coupon-type-code"]
          ? item.item["coupon-type-code"]
          : null,
      };
    })
    .sort((a, b) => {
      return parseInt(a.itemNumber) < parseInt(b.itemNumber)
        ? -1
        : parseInt(a.itemNumber) > parseInt(b.itemNumber)
        ? 1
        : 0;
    });
  return mappedItems;
};

export const mapOrderSet = (order) => {
  let formattedOrder = {
    id: order.id,
    userId: order.user.id,
    userName: order.user.name,
    orderDate: order["submitted-at"] ? order["submitted-at"] : "---",
    approvedDate: order["approved-at"] ? order["approved-at"] : "---",
    dueDate:
      order.program && order.program["order-calendar-month"]
        ? order.program["order-calendar-month"]["order-window-close-date"]
        : "---",
    inMarketDate:
      order.program && order.program["order-calendar-month"]
        ? order.program["order-calendar-month"]["in-market-start-date"]
        : "---",
    type: orderTypeMap[order.type],
    program:
      order.program && order.program.name
        ? [order.program.name]
        : order["order-set-items"] && order["order-set-items"].length > 0
        ? [
            ...new Set(
              [].concat.apply(
                [],
                order["order-set-items"].map((item) =>
                  item.item.programs.map((prog) => prog.name)
                )
              )
            ),
          ]
        : ["---"],
    brand:
      order.program && order.program.brands && order.program.brands.length > 0
        ? order.program.brands.map((brand) => brand.name)
        : order["order-set-items"] && order["order-set-items"].length > 0
        ? [
            ...new Set(
              [].concat.apply(
                [],
                order["order-set-items"].map((item) =>
                  item.item.brands.map((brand) => brand.name)
                )
              )
            ),
          ]
        : ["---"],
    territoryId: order.territory ? order.territory.id : "---",
    territories: order["territory-names"] ? order["territory-names"] : "---",
    state:
      order.orders && order.orders.length > 0
        ? [
            ...new Set(
              order.orders.map((ord) => {
                if (ord.distributor) {
                  return ord.distributor.state;
                } else {
                  return ord["custom-address"].state.code;
                }
              })
            ),
          ].join(", ")
        : "---",
    status: order.status,
    orderCount: order["order-count"],
    totalItems: order["total-quantity"],
    totalEstCost:
      order.orders && order.orders.length > 0
        ? order.orders
            .map((ord) => stringToCents(ord["total-estimated-cost"]))
            .reduce((a, b) => a + b)
        : 0,
    totalActCost: "---" /* TODO */,
    budget: order.budget ? stringToCents(order.budget) : "$25,000.00",
    hasRush:
      order["order-set-items"].filter((item) => item["is-rush"]).length > 0,
  };
  return formattedOrder;
};

export const mapOrderSetHistory = (orders) => {
  let mappedOrders = orders.map((order, i) => {
    let formattedOrder = mapOrderSet(order);
    return formattedOrder;
  });
  return mappedOrders;
};

export const mapRollupItems = (items) => {
  let mappedItems = items.map((item) => ({
    id: item.id,
    itemId: item.item.id,
    itemNumber: item["item-number"],
    projectNum: item["at-task-project-id"] ? item["at-task-project-id"] : "---",
    territory: item["territory-names"],
    brand: item["brand-names"] ? item["brand-names"].join(", ") : "---",
    program: item["order-program-name"] ? item["order-program-name"] : "---",
    programId: item["order-program"] ? item["order-program"].id : "---",
    itemType: item["item-type-description"],
    itemDescription: item.item.comment ? item.item.comment : "---",
    totalItems: item["total-ordered"],
    orderItemIds: item["order-item-ids"],
    totalNotCompliant: item["qty-pending-compliance"],
    supplier: item["supplier-name"] ? item["supplier-name"] : null,
    estCost: stringToCents(item["estimated-cost"]),
    totalEstCost: stringToCents(item["estimated-total"]),
    isRush: item["is-rush"] ? true : false,
    inMarketDate: item["in-market-date"]
      ? format(formatDate(new Date(item["in-market-date"])), "MM/dd/yyyy")
      : "---",
  }));

  return mappedItems;
};

export const mapPOItems = (items) => {
  let isPriceCompliant = true;
  let totalCost = 0;
  const mappedItems = items.map((item) => {
    if (!item["is-price-compliant"]) {
      isPriceCompliant = false;
    }
    let totalItemCost = stringToCents(item["actual-cost"]) * item.qty;
    totalCost += totalItemCost;
    if (item["is-direct-cost"]) {
      return {
        id: item.id,
        itemId: "---",
        itemNumber: "---",
        program: "---",
        itemType: "Set Up Fee",
        itemDescription: item["direct-cost-desc"],
        packSize: "1",
        itemSpec: "---",
        totalItems: item.qty,
        estCost: "---",
        actCost: stringToCents(item["actual-cost"]),
        totalCost: totalItemCost,
        isPriceCompliant: true,
        packout: false,
      };
    } else {
      return {
        id: item.id,
        itemId: item.item.id,
        itemNumber: item["item-number"],
        program:
          item["program-names"].length > 0 ? item["program-names"] : "---",
        itemType: item["item-type-description"],
        itemDescription: item.item.comment ? item.item.comment : "---",
        packSize: item["actual-qty-per-pack"],
        itemSpec: item["item-specification"],
        totalItems: item.qty,
        estCost: stringToCents(item["item-estimated-cost"]),
        actCost: stringToCents(item["actual-cost"]),
        totalCost: totalItemCost,
        isPriceCompliant: item["is-price-compliant"],
        packOut: item["has-packout"] ? item["has-packout"] : false,
        isCoupon: item["item-is-coupon"],
        couponStartDate: item["item-coupon-issue_date"]
          ? format(
              formatDate(new Date(item["item-coupon-issue-date"])),
              "MM/dd/yyyy"
            )
          : null,
        couponExpirationDate: item["item-coupon-expiration-date"]
          ? format(
              formatDate(new Date(item["item-coupon-expiration-date"])),
              "MM/dd/yyyy"
            )
          : null,
        couponOfferType: item["item-coupon-offer-type-code"]
          ? item["item-coupon-offer-type-code"]
          : null,
        couponOfferDescription: item["item-coupon-offer-description"]
          ? item["item-coupon-offer-description"]
          : null,
        couponTypeCode: item["item-coupon-type-code"]
          ? item["item-coupon-type-code"]
          : null,
      };
    }
  });
  return {
    items: mappedItems,
    compliant: isPriceCompliant,
    totalCost: totalCost,
  };
};

export const mapPOShippingParamItems = (items) => {
  let currentYear = getYear(new Date()).toString().slice(2);
  const mappedItems = items.map((item) => ({
    id: item.id,
    itemNumber: item["item-number"] ? item["item-number"] : "---",
    itemType: item["item-type-description"]
      ? item["item-type-description"]
      : "---",
    totalItems: item.qty,
    shipFromZip: item["ship-from-zip"] ? item["ship-from-zip"] : "---",
    carrier: item.carrier ? item.carrier : "---",
    method: item.method ? item.method : "---",
    actShipDate: item["actual-ship-date"] ? item["actual-ship-date"] : "---",
    shippedQuantity: item["shipped-qty"] ? item["shipped-qty"] : "---",
    packageCount: item["package-count"] ? item["package-count"] : "---",
    packageType: item["package-type"] ? item["packageType"] : "---",
    expectedArrival: item["expected-arrival-date"]
      ? item["expected-arrival-date"]
      : "---",
    shippingLabel: item["shipping-label"]
      ? `${item["shipping-label"].title} - ${item["shipping-label"].desc} - ${currentYear}-${item["shipping-label"].code}`
      : "---",
    trackingNum: item["tracking-number"] ? item["tracking-number"] : "---",
    shipHoldStatus: item["compliance-status"],
    tax: item.tax ? stringToCents(item.tax) : "---",
  }));
  return mappedItems;
};

export const mapPOShippingParams = (params) => {
  const formatAddress = (shipObj) => {
    let addOne = shipObj["street-address-1"];
    let addTwo = shipObj["street-address-2"]
      ? shipObj["street-address-2"]
      : false;
    let city = shipObj.city;
    let state = shipObj.state.code;
    let country = shipObj.country;
    let zip = shipObj.zip;
    return [addOne, addTwo, city, state, zip, country]
      .filter((address) => address)
      .join(", ");
  };
  const mappedParams = params.map((param) => {
    const handleCompStatus = (statusArray) => {
      if (statusArray.includes("denied")) {
        return "denied";
      } else if (statusArray.includes("prior-approval-pending")) {
        return "prior-approval-pending";
      } else {
        return "ok";
      }
    };
    let paramItems = mapPOShippingParamItems(param["shipping-parameter-items"]);
    let carriers = [...new Set(paramItems.map((item) => item.carrier))].join(
      ", "
    );
    let paramTaxArray = paramItems
      .map((item) => item.tax)
      .filter((tax) => tax !== "---");
    let totalParamTax =
      paramTaxArray.length > 0 ? paramTaxArray.reduce((a, b) => a + b) : 0;

    return {
      id: param.id,
      distributor: param.distributor ? param.distributor.name : "---",
      distributorId: param.distributor
        ? param.distributor["external-source-id"]
        : "---",
      name: param.name ? param.name : "---",
      attn: param.attn ? param.attn : "---",
      address: formatAddress(param),
      addressOne: param["street-address-1"],
      addressTwo: param["street-address-2"] ? param["street-address-2"] : "---",
      city: param.city,
      state: param.state.code,
      zip: param.zip,
      country: param.country,
      carrier: carriers,
      method: param.method ? param.method : "---",
      orderNote: param.notes ? param.notes : "---",
      actualShip: param["actual-ship-date"] ? param["actual-ship-date"] : "---",
      items: paramItems,
      isKeyAccount: param.territory && param.territory.type === "Customer",
      keyAccountName:
        param.territory && param.territory.type === "Customer"
          ? param.territory.name
          : "---",
      shipHoldStatus: handleCompStatus(
        paramItems.map((item) => item.shipHoldStatus)
      ),
      tax: totalParamTax,
    };
  });
  return mappedParams;
};

export const mapPurchaseOrder = (purchaseOrder) => {
  const params = mapPOShippingParams(purchaseOrder["shipping-parameters"]);
  const itemDetail = mapPOItems(purchaseOrder["purchase-order-items"]);

  const formattedPO = {
    id: purchaseOrder.id,
    brand: purchaseOrder["brand-names"],
    status: purchaseOrder.status,
    accepted: false,
    inMarketDate: purchaseOrder["in-market-date"]
      ? purchaseOrder["in-market-date"]
      : addDays(new Date(), 120),
    expectedShip: purchaseOrder["expected-ship-date"]
      ? purchaseOrder["expected-ship-date"]
      : addDays(new Date(), 90),
    terms: purchaseOrder.terms ? purchaseOrder.terms : "Net 30 Days",
    supplier: purchaseOrder.supplier.name,
    contactName: purchaseOrder.supplier.contact
      ? purchaseOrder.supplier.contact
      : "---",
    email: purchaseOrder.supplier.email ? purchaseOrder.supplier.email : "---",
    phone: purchaseOrder.supplier.phone ? purchaseOrder.supplier.phone : "---",
    purchasedBy: purchaseOrder.purchaser.name,
    method: purchaseOrder.method ? purchaseOrder.method : "",
    supplierNotes: purchaseOrder.note ? purchaseOrder.note : "",
    keyAcctTape: purchaseOrder["key-account-tape"]
      ? purchaseOrder["key-account-tape"]
      : "",
    additionalFile: purchaseOrder["additional-file-cloudinary-id"]
      ? purchaseOrder["additional-file-cloudinary-id"]
      : null,
    rfqNumber: purchaseOrder["rfq-number"]
      ? purchaseOrder["rfq-number"]
      : "---",
    poItems: itemDetail.items,
    totalFreight: stringToCents(purchaseOrder["total-freight-cost"]),
    totalCost: itemDetail.totalCost,
    directShip: purchaseOrder["is-direct-ship"],
    submittedDate: purchaseOrder["submitted-at"]
      ? format(
          formatDate(new Date(purchaseOrder["submitted-at"])),
          "MM/dd/yyyy"
        )
      : "---",
    shippingParams: params,
    shippingLabel: [
      ...new Set(
        [].concat.apply(
          [],
          params.map((param) => param.items.map((item) => item.shippingLabel))
        )
      ),
    ].join(", "),
    isPriceCompliant: itemDetail.compliant,
    onShipHold:
      params.filter(
        (param) =>
          param.shipHoldStatus === "prior-approval-pending" ||
          param.shipHoldStatus === "denied"
      ).length > 0,
    totalTax: params.map((param) => param.tax).reduce((a, b) => a + b),
  };
  return formattedPO;
};

export const mapPOHistoryItems = (items) => {
  const mappedItems = items.map((item) => {
    if (item["is-direct-cost"]) {
      return {
        id: item.id,
        allocated: item["po-is-direct-ship"] ? "Direct Ship" : "CDC",
        itemId: "---",
        poNum: item["purchase-order"].id,
        itemNumber: "---",
        projectNum: "---",
        supplier: "---",
        program: "---",
        itemType: "Set Up Fee",
        itemDesc: "---",
        brand: "---",
        packSize: "1",
        itemSpec: "---",
        totalItems: item.qty,
        estCost: "---",
        actCost: stringToCents(item["actual-cost"]),
        status: item["po-status"],
        isRush: item["is-rush"] ? true : false,
        submittedDate: item["po-submitted-at"]
          ? format(formatDate(new Date(item["po-submitted-at"])), "MM/dd/yyyy")
          : "---",
        inMarketDate: item["po-in-market-date"]
          ? format(
              formatDate(new Date(item["po-in-market-date"])),
              "MM/dd/yyyy"
            )
          : "---",
      };
    } else {
      return {
        id: item.id,
        allocated: item["po-is-direct-ship"] ? "Direct Ship" : "CDC",
        itemId: item.item.id,
        poNum: item["purchase-order"].id,
        itemNumber: item["item-number"],
        projectNum: item["item-at-task-project-id"]
          ? item["item-at-task-project-id"]
          : "---",
        supplier: item["supplier-name"] ? item["supplier-name"] : "---",
        itemType: item["item-type-description"],
        itemDesc: item["item-description"] ? item["item-description"] : "---",
        brand: item["brand-names"],
        program: item["program-names"],
        purchasedBy: item["po-purchaser-name"]
          ? item["po-purchaser-name"]
          : "---",
        totalItems: item.qty,
        estCost: stringToCents(item["item-estimated-cost"]),
        actCost: stringToCents(item["actual-cost"]),
        status: item["po-status"],
        isRush: item["is-rush"] ? true : false,
        submittedDate: item["po-submitted-at"]
          ? format(formatDate(new Date(item["po-submitted-at"])), "MM/dd/yyyy")
          : "---",
        inMarketDate: item["po-in-market-date"]
          ? format(
              formatDate(new Date(item["po-in-market-date"])),
              "MM/dd/yyyy"
            )
          : "---",
      };
    }
  });
  return mappedItems;
};

export const mapBids = (bids) => {
  return bids.map((bid) => ({
    id: bid.id,
    status: bid.status,
    supplierId: bid.supplier ? bid.supplier.id : bid.id,
    note: bid.note ? bid.note : "",
    price: bid.price ? stringToCents(bid.price) : 0,
  }));
};

export const mapRFQ = (rfq) => {
  const images = handleImages([rfq.item.images]);
  let mappedRFQ = {
    id: rfq.id,
    status: rfq.status ? rfq.status : "Pending",
    dueDate: rfq["due-date"]
      ? format(formatDate(new Date(rfq["due-date"])), "MM/dd/yyyy")
      : "---",
    inMarketDate: rfq.program
      ? format(formatDate(new Date(rfq.program["start-date"])), "MM/dd/yyyy")
      : "---",
    bids: mapBids(rfq.bids),
    program: rfq.program.name,
    brand: rfq.item.brands.map((brand) => brand.name).join(", "),
    itemType: rfq.item.type,
    itemDescription: rfq.item.comment ? rfq.item.comment : "---",
    projectNum: rfq.item["at-task-project-id"],
    itemNumber: rfq.item["item-number"],
    totalItems: rfq.qty,
    estCost: stringToCents(rfq.item["estimated-cost"]),
    totalEstCost: rfq.qty * stringToCents(rfq.item["estimated-cost"]),
    supplierNote: rfq.note ? rfq.note : "",
    itemSpec: rfq.item.specification ? rfq.item.specification : null,
    imgUrlThumb: images.imgUrlThumb,
    imgUrlLg: images.imgUrlLg,
  };

  return mappedRFQ;
};

export const mapRFQHistory = (rfqs) => {
  let mappedRFQHistory = rfqs.map((rfq) => mapRFQ(rfq));
  return mappedRFQHistory;
};

export const mapRules = (rules) => {
  let mappedRules = rules.map((rule) => ({
    id: rule.id,
    ruleType: typeMap[rule.type],
    desc: rule.description,
    itemTypeCode: rule["item-type-category-code"]
      ? rule["item-type-category-code"]
      : "---",
    itemTypes:
      rule["item-type-descriptions"].length > 0
        ? rule["item-type-descriptions"].join(", ")
        : "---",
    price: rule.price ? stringToCents(rule.price) : "---",
    productFamilies:
      rule["product-family-names"].length > 0
        ? rule["product-family-names"].join(", ")
        : "---",
    states: rule["state-codes"].join(", "),
  }));
  return mappedRules;
};

export const mapCompItems = (items) => {
  const statusMap = {
    "prior-approval-pending": "Pending",
    "in-violation": "In Violation",
    approved: "Approved",
  };
  let mappedItems = items.map((item) => ({
    id: item.id,
    itemNumber: item["item-number"],
    program: item["most-recent-program-name"],
    brand: item["brand-names"] ? item["brand-names"] : "---",
    itemType: item["item-type-description"],
    ruleType: typeMap[item.rule.type],
    ruleDesc: item.rule.description,
    status: statusMap[item.status],
    state: item.state.code,
    //These two are placeholder for now
    active: true,
    emailSent: item["email-sent-at"]
      ? format(formatDate(new Date(item["email-sent-at"])), "MM/dd/yyyy")
      : "---",
  }));
  return mappedItems;
};

export const sortTerritories = (terrArray) => {
  if (terrArray.length === 0) {
    return [];
  } else if (terrArray.length === 1) {
    return [
      {
        name: terrArray[0].name,
        id: terrArray[0].id,
        type: terrArray[0].type,
        code: terrArray[0]["external-id"],
        states: terrArray[0].states,
      },
    ];
  } else {
    let regional = [];
    let customer = [];
    terrArray.forEach((terr) => {
      if (terr.type === "Regional") {
        regional.push(terr);
      } else {
        customer.push(terr);
      }
    });
    regional = regional
      .map((terr) => ({
        name: terr.name,
        id: terr.id,
        type: terr.type,
        code: terr["external-id"],
        states: terr.states,
      }))
      .sort((a, b) => {
        return a.name[0].toLowerCase() < b.name[0].toLowerCase()
          ? -1
          : a.name[0].toLowerCase() > b.name[0].toLowerCase()
          ? 1
          : 0;
      });
    customer = customer
      .map((terr) => ({
        name: terr.name,
        id: terr.id,
        type: terr.type,
        code: terr["external-id"],
        states: terr.states,
      }))
      .sort((a, b) => {
        return a.name[0].toLowerCase() < b.name[0].toLowerCase()
          ? -1
          : a.name[0].toLowerCase() > b.name[0].toLowerCase()
          ? 1
          : 0;
      });
    return regional.concat(customer);
  }
};
