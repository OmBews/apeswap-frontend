import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Text, Checkbox, useMatchBreakpoints } from '@apeswapfinance/uikit'
import useTheme from 'hooks/useTheme'
import { getBalanceNumber } from 'utils/formatBalance'
import BigNumber from 'bignumber.js'
import TokenInput from './TokenInput'
import { TokenSaleDetails, ExtendedERC20Details } from '../types'

interface PresaleDataProps {
  pairTokenDetails: ExtendedERC20Details
  onChange?: (presaleDetails: TokenSaleDetails) => void
}

const LaunchPadInfoWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 800px;
  width: 280px;
  border-radius: 10px;
  background-color: ${(props) => (props.theme.isDark ? '#414141' : 'white')};
  margin-bottom: 30px;
  align-items: space-between;
  justify-content: center;
  padding: 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 686px;
    height: 524px;
  }
`
const StyledHeader = styled(Text)`
  font-family: Poppins;
  font-size: 18px;
  line-height: 27px;
  margin-top: 15px;
  font-weight: 700;
  text-align: center;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 22px;
  }
`

const CheckboxContainer = styled.div`
  display: flex;
  width: 60px;
  height: 60px;
  justify-content: center;
  align-items: center;
`

const FooterContainer = styled.div`
  display: flex;
  width: 450px;
  height: 60px;
  justify-content: space-between;
  align-items: center;
`

const StyledText = styled(Text)`
  font-family: Poppins;
  font-size: 12px;
  font-weight: 400;
  margin-left: 15px;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 16px;
  }
`

const PresaleDetails: React.FC<PresaleDataProps> = ({ pairTokenDetails, onChange }) => {
  const { isMd, isSm, isXs } = useMatchBreakpoints()
  const isMobile = isMd || isSm || isXs
  const { tokenSymbol, quoteToken, userBalance, tokenDecimals } = pairTokenDetails
  const { isDark } = useTheme()
  const [tokenDetails, setTokenDetails] = useState<TokenSaleDetails>({
    tokensForSale: null,
    pricePerToken: null,
    limitPerUser: null,
    softcap: null,
    burnRemains: false,
  })
  const balance = getBalanceNumber(new BigNumber(userBalance), tokenDecimals)

  useEffect(() => {
    onChange(tokenDetails)
  }, [tokenDetails, onChange])

  return (
    <>
      <LaunchPadInfoWrapper>
        <StyledHeader>How many {tokenSymbol} are up for presale?</StyledHeader>
        <TokenInput
          onChange={(e) => setTokenDetails({ ...tokenDetails, tokensForSale: e.currentTarget.value })}
          size="lg"
          tokenSymbol={tokenSymbol}
          userBalance={balance}
          backgroundColor={isDark ? 'rgba(51, 51, 51, 1)' : '#E5E5E5'}
          min={0}
          max={balance}
        />
        <TokenInput
          onChange={(e) => setTokenDetails({ ...tokenDetails, pricePerToken: e.currentTarget.value })}
          title={`Price of 1 ${tokenSymbol}`}
          mr={isMobile ? '0px' : '12.5px'}
          quoteTokenSymbol={quoteToken}
          size="md"
          backgroundColor={isDark ? 'rgba(51, 51, 51, 1)' : '#E5E5E5'}
          min={0}
        />
        <TokenInput
          onChange={(e) => setTokenDetails({ ...tokenDetails, limitPerUser: e.currentTarget.value })}
          title={`${quoteToken} limit per user`}
          quoteTokenSymbol={quoteToken}
          ml={isMobile ? '0px' : '12.5px'}
          size="md"
          backgroundColor={isDark ? 'rgba(51, 51, 51, 1)' : '#E5E5E5'}
          min={0}
        />
        <TokenInput
          onChange={(e) => setTokenDetails({ ...tokenDetails, softcap: e.currentTarget.value })}
          title="Softcap"
          quoteTokenSymbol={quoteToken}
          mr={isMobile ? '0px' : '12.5px'}
          size="md"
          backgroundColor={isDark ? 'rgba(51, 51, 51, 1)' : '#E5E5E5'}
          min={0}
          max={parseFloat(tokenDetails?.tokensForSale) * parseFloat(tokenDetails?.pricePerToken)}
        />
        <TokenInput
          defaultVal={(parseFloat(tokenDetails?.tokensForSale) * parseFloat(tokenDetails?.pricePerToken)).toString()}
          title="Hardcap"
          ml={isMobile ? '0px' : '12.5px'}
          size="md"
          disabled
          quoteTokenSymbol={quoteToken}
          backgroundColor={isDark ? 'rgba(51, 51, 51, 1)' : '#E5E5E5'}
          min={0}
        />
        <FooterContainer>
          <CheckboxContainer>
            <Checkbox
              checked={tokenDetails?.burnRemains}
              onChange={() => setTokenDetails({ ...tokenDetails, burnRemains: !tokenDetails?.burnRemains })}
            />
          </CheckboxContainer>
          <StyledText>
            If softcap is met, but hardcap is not, burn the remaining tokens allocated to the token sale.
          </StyledText>
        </FooterContainer>
      </LaunchPadInfoWrapper>
    </>
  )
}

export default React.memo(PresaleDetails)
