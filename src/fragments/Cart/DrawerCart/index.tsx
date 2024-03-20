import React from 'react';
import {SafeAreaView, ScrollView, View} from 'react-native';
import {DrawerNavigationHelpers} from '@react-navigation/drawer/lib/typescript/src/types';
import {useCartStore} from '@/store/useCart';
import TextView from '@/components/TextView';
import CartItemView from '../CartItemView';
import ButtonView from '@/components/Button';
import {styles} from './styles';

type DrawerNavigationProps = {
  navigation: DrawerNavigationHelpers;
};

export default function DrawerCart({navigation}: DrawerNavigationProps) {
  const cart = useCartStore.use.cart();
  const updateCart = useCartStore.use.updateCart();
  const selectCartItem = useCartStore.use.selectCartItem();
  const clearCart = useCartStore.use.clearCart();

  const handleCounter = (val: number, id: number) => {
    updateCart(val, id);
  };

  const handleSelectedCart = (id: number, val: boolean) => {
    selectCartItem(val, id);
  };

  return (
    <View style={styles.base}>
      <SafeAreaView />
      <TextView fz={24} fw="bold">
        Cart
      </TextView>
      <View style={styles.content}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.cartContainer}>
            {cart.length === 0 && <TextView>No item in Cart</TextView>}
            {cart.length !== 0 &&
              cart?.map(val => {
                return (
                  <CartItemView
                    data={val}
                    handleCounter={handleCounter}
                    handleSelectedCart={handleSelectedCart}
                    key={val.id}
                  />
                );
              })}
          </View>
        </ScrollView>
        <View style={styles.checkoutInfo}>
          <View style={styles.flexRow}>
            <TextView>Total Item</TextView>
            <TextView fw="bold">
              {cart.filter(val => val.selected).length}
            </TextView>
          </View>
          <View style={styles.flexRow}>
            <TextView>Sub Total</TextView>
            <TextView fw="bold">
              $
              {cart
                .filter(val => val.selected)
                .reduce((sum, product) => sum + (product?.total || 0), 0)
                .toFixed(2)}
            </TextView>
          </View>
        </View>
        <View style={styles.btnContainer}>
          <ButtonView
            label="Checkout"
            onPress={() => navigation.navigate('Checkout')}
            size="sm"
          />
          <ButtonView
            label="Clear Cart"
            onPress={() => clearCart()}
            size="sm"
            variant="outline"
          />
        </View>
      </View>
    </View>
  );
}
