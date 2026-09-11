import { FC, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector } from '../../services/store';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const feedOrders = useSelector((state) => state.feed.orders);
  const profileOrders = useSelector((state) => state.feed.orders);
  const allIngredients = useSelector((state) => state.ingredients.ingredients);

  const allOrders = [...feedOrders, ...profileOrders];
  const orderData = allOrders.find((order) => order.number === Number(number));

  const orderInfo = useMemo(() => {
    if (!orderData || !allIngredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = allIngredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, allIngredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
