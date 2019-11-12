import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconCommunity from 'react-native-vector-icons/MaterialCommunityIcons';

import { formatPricePtBr } from '../../util/format';
import * as CartActions from '../../store/modules/cart/actions';
import {
  Container1,
  Container2,
  ProductList,
  Product,
  ProductInfo,
  Thumbnail,
  ProductDetails,
  ProductTitle,
  ProductPrice,
  RemoveProduct,
  ProductOrder,
  ProductQuantityAdjustment,
  ProductIncrease,
  ProductQuantity,
  ProductDecrease,
  SubTotal,
  Footer,
  TotalText,
  Total,
  BuyButton,
  BuyButtonLabel,
  EmptyCart,
  EmptyCartText,
} from './styles';

function Cart({ cart, total, removeFromCart, updateAmountRequest }) {
  const decrement = product => {
    updateAmountRequest(product.id, product.amount - 1);
  };

  const increment = product => {
    updateAmountRequest(product.id, product.amount + 1);
  };

  return (
    <Container1>
      {cart.length ? (
        <Container2>
          <ProductList
            data={cart}
            keyExtractor={product => String(product.id)}
            renderItem={({ item }) => (
              <Product>
                <ProductInfo>
                  <Thumbnail source={{ uri: item.image }} />
                  <ProductDetails>
                    <ProductTitle>{item.title}</ProductTitle>
                    <ProductPrice>{item.price}</ProductPrice>
                  </ProductDetails>
                  <RemoveProduct onPress={() => removeFromCart(item.id)}>
                    <IconCommunity name="trash-can" size={25} color="#7159c1" />
                  </RemoveProduct>
                </ProductInfo>
                <ProductOrder>
                  <ProductQuantityAdjustment>
                    <ProductDecrease onPress={() => decrement(item)}>
                      <Icon
                        name="remove-circle-outline"
                        size={20}
                        color="#7159c1"
                      />
                    </ProductDecrease>
                    <ProductQuantity editable={false}>
                      {item.amount}
                    </ProductQuantity>
                    <ProductIncrease onPress={() => increment(item)}>
                      <Icon
                        name="add-circle-outline"
                        size={20}
                        color="#7159c1"
                      />
                    </ProductIncrease>
                  </ProductQuantityAdjustment>
                  <SubTotal>{item.formattedSubtotal}</SubTotal>
                </ProductOrder>
              </Product>
            )}
          />

          <Footer>
            <TotalText>TOTAL</TotalText>
            <Total>{total}</Total>
            <BuyButton>
              <BuyButtonLabel>FINALIZAR PEDIDO</BuyButtonLabel>
            </BuyButton>
          </Footer>
        </Container2>
      ) : (
        <EmptyCart>
          <Icon name="remove-shopping-cart" size={100} color="#ECECEC" />
          <EmptyCartText>Seu carrinho está vazio</EmptyCartText>
        </EmptyCart>
      )}
    </Container1>
  );
}

Cart.propTypes = {
  cart: PropTypes.array.isRequired,
  total: PropTypes.shape().isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateAmountRequest: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  cart: state.cart.map(product => ({
    ...product,
    formattedSubtotal: formatPricePtBr(product.price * product.amount),
  })),
  total: formatPricePtBr(
    state.cart.reduce((total, product) => {
      return total + product.price * product.amount;
    }, 0)
  ),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CartActions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Cart);
