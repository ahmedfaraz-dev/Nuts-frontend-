const toNumber = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
};

export const getProductRatingSummary = (product) => {
  if (!product) {
    return { average: 0, count: 0 };
  }

  const directAverage = toNumber(
    product.averageRating ?? product.avgRating ?? product.ratingsAverage ?? product.rating
  );
  const directCount = toNumber(
    product.ratingsCount ?? product.numOfReviews ?? product.reviewCount ?? product.totalRatings
  );

  const reviews = Array.isArray(product.reviews)
    ? product.reviews
    : Array.isArray(product.ratings)
    ? product.ratings
    : [];

  if (directAverage !== null && directCount !== null) {
    return {
      average: Math.max(0, Math.min(5, directAverage)),
      count: Math.max(0, directCount),
    };
  }

  if (!reviews.length) {
    return { average: Math.max(0, Math.min(5, directAverage || 0)), count: directCount || 0 };
  }

  const values = reviews
    .map((review) => toNumber(review.rating ?? review.stars))
    .filter((v) => v !== null);

  if (!values.length) {
    return { average: 0, count: reviews.length };
  }

  const sum = values.reduce((acc, value) => acc + value, 0);
  return {
    average: sum / values.length,
    count: values.length,
  };
};

export const getProductReviews = (product) => {
  if (!product) return [];
  if (Array.isArray(product.reviews)) return product.reviews;
  if (Array.isArray(product.ratings)) return product.ratings;
  return [];
};

export const getOrderItemProductId = (item) => {
  if (!item || typeof item !== "object") return null;
  const productRef = item.product || item.productId;
  if (typeof productRef === "string") return productRef;
  if (productRef && typeof productRef === "object") {
    return productRef._id || productRef.id || null;
  }
  return item._id || item.id || null;
};

export const getPendingRatingItems = (orders, ratedProductIds = []) => {
  if (!Array.isArray(orders)) return [];

  const ratedSet = new Set(ratedProductIds);
  const pendingMap = new Map();

  orders.forEach((order) => {
    const status = String(order?.orderStatus || "").toLowerCase();
    const paymentDone =
      status === "delivered" ||
      String(order?.paymentStatus || "").toLowerCase() === "paid" ||
      String(order?.status || "").toLowerCase() === "delivered";

    if (!paymentDone || status !== "delivered") return;

    const items = Array.isArray(order?.items) ? order.items : [];
    items.forEach((item) => {
      const productId = getOrderItemProductId(item);
      const serverMarkedRated = item?.isRated === true || item?.rated === true;
      if (!productId || serverMarkedRated || ratedSet.has(productId) || pendingMap.has(productId)) return;

      pendingMap.set(productId, {
        productId,
        orderId: order?._id || order?.id || null,
        userId:
          (typeof order?.user === "string" && order.user) ||
          order?.user?._id ||
          order?.user?.id ||
          order?.userId ||
          order?.customerInfo?.userId ||
          null,
        productName: item?.name || item?.title || "Product",
        image: item?.image || "",
      });
    });
  });

  return Array.from(pendingMap.values());
};
