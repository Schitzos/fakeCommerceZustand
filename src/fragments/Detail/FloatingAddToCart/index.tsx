import ButtonView from '@/components/Button';
import TextView from '@/components/TextView';
import {useCartStore} from '@/hooks/useCart';
import React, {useCallback} from 'react';
import {View} from 'react-native';
import {styles} from './styles';
import {useCounterStore} from '@/hooks/useCounter';
import {ProductItemProps} from '@/types/Product';
import {
  DrawerActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';

type FloatingAddToCartProps = {
  data: ProductItemProps;
};

export default function FloatingAddToCart({data}: FloatingAddToCartProps) {
  const addToCart = useCartStore.use.addToCart();
  const count = useCounterStore.use.count();
  const cart = useCartStore.use.cart();
  const productOnCart = cart.find(val => val.id === data.id);
  const navigation = useNavigation();
  const resetCount = useCounterStore.use.resetCount();

  const handleAddToCart = useCallback(() => {
    const payload = {
      ...data,
      count: count,
      total: data?.price * count,
      selected: true,
    };
    addToCart(payload);
    navigation.dispatch(DrawerActions.openDrawer());
    resetCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        resetCount();
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );
  console.log('render floating');
  return (
    <View style={styles.btnContainer}>
      <View style={styles.orderInfo}>
        <View>
          <TextView>Total Order</TextView>
          <TextView fz={20} fw="600" align="left">
            ${(data.price * count).toFixed(2)}
          </TextView>
        </View>
        {productOnCart && (
          <View>
            <TextView fw="bold">
              Currently {productOnCart?.count} item in Cart
            </TextView>
          </View>
        )}
      </View>
      <ButtonView
        onPress={() => handleAddToCart()}
        label="Add to Cart"
        size="md"
      />
    </View>
  );
}
