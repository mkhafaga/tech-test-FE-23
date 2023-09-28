'use client'
/** Implement component Payouts which fetches https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts */

import { use, useEffect } from "react"

export default function Payouts() {
    useEffect(() => {
        fetch('https://theseus-staging.lithium.ventures/api/v1/analytics/tech-test/payouts')
        .then(response => response.json())
        .then(data => console.log(data));
    }, [])
  return (
    <div>
      <h1>Payouts</h1>
    </div>
  )
}