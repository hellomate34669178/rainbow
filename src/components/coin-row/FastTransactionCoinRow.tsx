import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { ButtonPressAnimation } from '../animations';
import FastCoinIcon from '../asset-list/RecyclerAssetList2/FastComponents/FastCoinIcon';
import FastTransactionStatusBadge from './FastTransactionStatusBadge';
import { Text } from '@/design-system';
import { TransactionStatusTypes, TransactionTypes } from '@/entities';
import { ThemeContextProps } from '@/theme';
import { showTransactionDetailsSheet } from '@/handlers/transactions';
import { Contact } from '@/redux/contacts';

const BottomRow = React.memo(function BottomRow({
  description,
  nativeDisplay,
  status,
  type,
  theme,
}: {
  description: string;
  nativeDisplay: any;
  status: keyof typeof TransactionStatusTypes;
  type: keyof typeof TransactionTypes;
  theme: ThemeContextProps;
}) {
  const { colors } = theme;
  const isFailed = status === TransactionStatusTypes.failed;
  const isReceived =
    status === TransactionStatusTypes.received ||
    status === TransactionStatusTypes.purchased;
  const isSent = status === TransactionStatusTypes.sent;

  const isOutgoingSwap = status === TransactionStatusTypes.swapped;
  const isIncomingSwap =
    status === TransactionStatusTypes.received &&
    type === TransactionTypes.trade;

  let coinNameColor = colors.dark;
  if (isOutgoingSwap) coinNameColor = colors.blueGreyDark50;

  let balanceTextColor = colors.blueGreyDark50;
  if (isReceived) balanceTextColor = colors.green;
  if (isSent) balanceTextColor = colors.dark;
  if (isIncomingSwap) balanceTextColor = colors.swapPurple;
  if (isOutgoingSwap) balanceTextColor = colors.dark;

  const balanceText = nativeDisplay
    ? [isFailed || isSent ? '-' : null, nativeDisplay].filter(Boolean).join(' ')
    : '';

  return (
    <View style={sx.bottomRow}>
      <View style={sx.description}>
        <Text
          color={{ custom: coinNameColor || colors.dark }}
          numberOfLines={1}
          size="16px / 22px (Deprecated)"
        >
          {description}
        </Text>
      </View>
      <View style={sx.nativeBalance}>
        <Text
          align="right"
          color={{ custom: balanceTextColor ?? colors.dark }}
          size="16px / 22px (Deprecated)"
          weight={isReceived ? 'medium' : undefined}
        >
          {balanceText}
        </Text>
      </View>
    </View>
  );
});

export default React.memo(function TransactionCoinRow({
  accountAddress,
  contacts,
  item,
  theme,
}: {
  accountAddress: string;
  contacts: { [p: string]: Contact };
  item: any;
  theme: ThemeContextProps;
}) {
  const { mainnetAddress } = item;
  const { colors } = theme;

  const onPress = useCallback(() => {
    showTransactionDetailsSheet(item, contacts, accountAddress);
  }, [item, contacts, accountAddress]);

  return (
    <ButtonPressAnimation onPress={onPress} scaleTo={0.96}>
      <View
        style={sx.wholeRow}
        testID={`${item.title}-${item.description}-${item.balance?.display}`}
      >
        <View style={sx.icon}>
          <FastCoinIcon
            address={mainnetAddress || item.address}
            assetType={item.network}
            mainnetAddress={mainnetAddress}
            symbol={item.symbol}
            theme={theme}
          />
        </View>
        <View style={sx.column}>
          <View style={sx.topRow}>
            <FastTransactionStatusBadge
              colors={colors}
              pending={item.pending}
              status={item.status}
              title={item.title}
            />
            <View style={sx.balance}>
              <Text
                color={{ custom: colors.alpha(colors.blueGreyDark, 0.5) }}
                numberOfLines={1}
                size="14px / 19px (Deprecated)"
              >
                {item.balance?.display ?? ''}
              </Text>
            </View>
          </View>
          <BottomRow
            description={item.description}
            nativeDisplay={item.native?.display}
            status={item.status}
            theme={theme}
            type={item.type}
          />
        </View>
      </View>
    </ButtonPressAnimation>
  );
});

const sx = StyleSheet.create({
  balance: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 8,
  },
  bottomRow: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  column: {
    flex: 1,
    justifyContent: 'center',
    marginLeft: 10,
  },
  description: {
    flex: 1,
  },
  icon: {
    justifyContent: 'center',
  },
  nativeBalance: {
    marginLeft: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  wholeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 19,
  },
});
