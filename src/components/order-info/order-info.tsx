import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getOrderByNumber } from '../../services/slices/feed-slice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const feedOrders = useSelector((state) => state.feed.orders);
  const userOrders = useSelector((state) => state.feed.userOrders);
  const fetchedOrder = useSelector((state) => state.feed.orderData);
  const allIngredients = useSelector((state) => state.ingredients.ingredients);

  const orderData = useMemo(() => {
    const found = [...feedOrders, ...userOrders].find(
      (order) => order.number === Number(number)
    );
    if (found) return found;
    if (fetchedOrder && fetchedOrder.number === Number(number)) {
      return fetchedOrder;
    }
    return null;
  }, [number, feedOrders, userOrders, fetchedOrder]);

  useEffect(() => {
    if (!orderData && number) {
      dispatch(getOrderByNumber(Number(number)));
    }
  }, [dispatch, number, orderData]);

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
