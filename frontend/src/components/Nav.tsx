import { ConnectButton } from '@rainbow-me/rainbowkit'
import styled from 'styled-components'

import { useSharedState } from '@/utils/store'

import styles from '../styles/styles.module.css'

const Wrapper = styled.div`
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  position: fixed;
  margin-right: auto;
  margin-left: auto;
`

const Title = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
`

export function Nav() {
  const [{ user }] = useSharedState()
  console.log(user)
  return (
    <Wrapper>
      <Title>
        <a href="/">💰 GHO Grants</a>
      </Title>
      <div style={{ display: 'flex', gap: '10px' }}>
        {user && (
          <button
            className={styles.connectButton}
            style={{ display: 'flex', gap: '10px', alignItems: 'center' }}
          >
            <img
              src="/images/github.png"
              alt={`Github image`}
              width={15}
              height={15}
            />
            {user.login}
          </button>
        )}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            // Note: If your app doesn't use authentication, you
            // can remove all 'authenticationStatus' checks
            const ready = mounted && authenticationStatus !== 'loading'
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === 'authenticated')

            return (
              <div
                {...(!ready && {
                  'aria-hidden': true,
                  style: {
                    opacity: 0,
                    pointerEvents: 'none',
                    userSelect: 'none',
                  },
                })}
              >
                {(() => {
                  if (!connected) {
                    return (
                      <button
                        onClick={openConnectModal}
                        type="button"
                        className={styles.connectButton}
                      >
                        Connect Wallet
                      </button>
                    )
                  }
                  if (chain.unsupported) {
                    return (
                      <button
                        onClick={openChainModal}
                        type="button"
                        className={styles.connectButton}
                      >
                        Wrong network
                      </button>
                    )
                  }
                  return (
                    <div style={{ display: 'flex', gap: 12 }}>
                      <button
                        onClick={openChainModal}
                        style={{ display: 'flex', alignItems: 'center' }}
                        type="button"
                        className={styles.connectButton}
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 20,
                              height: 20,
                              borderRadius: 999,
                              overflow: 'hidden',
                              marginRight: 4,
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 20, height: 20 }}
                              />
                            )}
                          </div>
                        )}
                        {chain.name}
                      </button>
                      <button
                        onClick={openAccountModal}
                        type="button"
                        className={styles.connectButton}
                      >
                        {account.displayName}
                        {account.displayBalance
                          ? ` (${account.displayBalance})`
                          : ''}
                      </button>
                    </div>
                  )
                })()}
              </div>
            )
          }}
        </ConnectButton.Custom>
      </div>
    </Wrapper>
  )
}
