import { Migrations } from "meteor/percolate:migrations";
import Logger from "@reactioncommerce/logger";
import { Products } from "/lib/collections";
import { publishProductsToCatalog } from "/imports/plugins/core/catalog/server/methods/catalog";

Migrations.add({
  version: 24,
  up() {
    const visiblePublishedProducts = Products.find({
      ancestors: [],
      isDeleted: { $ne: true },
      isVisible: true,
      type: "simple"
    }, { _id: 1 }).map((product) => product._id);
    const success = Promise.await(publishProductsToCatalog(visiblePublishedProducts));
    if (!success) {
      Logger.error("Migration 24 failed to create catalog products for some published products.");
    }
  }
});
