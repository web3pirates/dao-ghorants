import styled from 'styled-components'

import { GithubIcon, TwitterIcon } from '@/assets/icons'
import { mq } from '@/styles/breakpoints'

export const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;

  @media ${mq.sm.max} {
    gap: 0.75rem;
    flex-direction: column-reverse;
  }
`

export const Links = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
`

const Link = styled.a`
  color: rgba(0, 0, 0, 0.5);
  font-weight: 600;
  transition: color 0.15s ease-in-out;

  @media (hover: hover) {
    &:hover {
      color: rgba(0, 0, 0, 1);
    }
  }
`

export function Footer() {
  return (
    <Wrapper>
      <Links>
        <Link href="https://twitter.com/luduvigo" target="_blank">
          luduvigo
        </Link>
        <Link href="https://twitter.com/0xreekee" target="_blank">
          reekee
        </Link>
        <Link href="https://twitter.com/lorenzo_fel" target="_blank">
          birb
        </Link>
        <Link href="https://twitter.com/CKobril" target="_blank">
          ckobril
        </Link>
        <Link href="https://twitter.com/albygiaco98" target="_blank">
          albygiaco
        </Link>
      </Links>

      <Links>
        <Link href="https://twitter.com/Tide_web3" target="_blank">
          <TwitterIcon />
        </Link>
        <Link
          href="https://github.com/web3pirates/dao-ghorants"
          target="_blank"
        >
          <GithubIcon />
        </Link>
      </Links>
    </Wrapper>
  )
}
