import { useState } from "react";
import { Form, Toast } from "@shopify/polaris";
import { useTranslation } from "react-i18next";
import { useAppQuery, useAuthenticatedFetch } from "../hooks";

export function ProductsCard() {
  const emptyToastProps = { content: null };
  const [toastProps, setToastProps] = useState(emptyToastProps);
  const [value, setValue] = useState({
    name: "",
    price: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetch = useAuthenticatedFetch();
  const { t } = useTranslation();
  const productsCount = 5;

  const {
    refetch: refetchProductCount,
    isLoading: isLoadingCount,
    isRefetching: isRefetchingCount,
  } = useAppQuery({
    url: "/api/products/count",
    reactQueryOptions: {
      onSuccess: () => {
        setIsLoading(false);
      },
    },
  });



  const handlePopulate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setValue({
      name: "",
      price: "",
    });
    const formData = {
      title: value.name,
      variants: [{ price: value.price }],
    };

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    };

    const response = await fetch("/api/products/create", requestOptions);

    if (response.ok) {
      await refetchProductCount();
      setToastProps({
        content: t("ProductsCard.productsCreatedToast", {
          count: productsCount,
        }),
      });
    } else {
      setIsLoading(false);
      setToastProps({
        content: t("ProductsCard.errorCreatingProductsToast"),
        error: true,
      });
    }
  };

  const handleInputChange = (name, newValue) => {
    setValue((prevValue) => ({
      ...prevValue,
      [name]: newValue,
    }));
    console.log(value, "value")
  };
  console.log(value, "value")
  return (
    <>
      <Form onSubmit={handlePopulate}>
        <input
          onChange={(e) => handleInputChange("name", e.target.value)}
          name="Product_title"
          type="text"
          placeholder="Enter title"
        />
        <input
          onChange={(e) => handleInputChange("price", e.target.value)}
          name="Product_price"
          type="text"
          placeholder="Enter price"
        />
        <button type="submit">Submit</button>
      </Form>
    </>
  );
}
