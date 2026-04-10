import dbConnect from "@/lib/dbConnect";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ApiFeatures from "@/utils/apiFeatures";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    
    // Parse nested query params (e.g., price[lte]=1000)
    const queryStr = {};
    searchParams.forEach((value, key) => {
      if (key.includes("[") && key.includes("]")) {
        const [field, operatorPart] = key.split("[");
        const operator = operatorPart.replace("]", "");
        if (!queryStr[field]) queryStr[field] = {};
        queryStr[field][operator] = value;
      } else {
        queryStr[key] = value;
      }
    });

    // Handle Category Hierarchy
    if (queryStr.category) {
      // Fetch all categories to build the hierarchy in memory
      const allCategories = await Category.find();
      
      // Recursive function to get all subcategory IDs
      const getSubCategoryIds = (parentId) => {
        let ids = [parentId];
        const children = allCategories.filter(
          (cat) => cat.parent?.toString() === parentId.toString()
        );
        for (const child of children) {
          ids = [...ids, ...getSubCategoryIds(child._id)];
        }
        return ids;
      };

      const categoryIds = getSubCategoryIds(queryStr.category);
      queryStr.category = { $in: categoryIds };
    }

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find().populate("category"), queryStr)
      .search()
      .filter()
      .sort();

    let products = await apiFeature.query;
    let filteredProductsCount = products.length;

    apiFeature.pagination(resultPerPage);
    products = await apiFeature.query.clone();

    return NextResponse.json({
      success: true,
      products,
      productsCount,
      resultPerPage,
      filteredProductsCount,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
