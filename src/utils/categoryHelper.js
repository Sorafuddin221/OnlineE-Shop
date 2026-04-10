export const nestCategories = (categories, parentId = null) => {
  const categoryList = [];
  let category;
  
  if (parentId === null) {
    category = categories.filter((cat) => !cat.parent);
  } else {
    category = categories.filter((cat) => cat.parent?.toString() === parentId.toString());
  }

  for (let cate of category) {
    categoryList.push({
      _id: cate._id,
      name: cate.name,
      image: cate.image,
      parent: cate.parent,
      children: nestCategories(categories, cate._id),
    });
  }

  return categoryList;
};
