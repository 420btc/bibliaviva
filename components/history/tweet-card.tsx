"use client"

import { Tweet } from 'react-tweet'

export function TweetCard({ id }: { id: string }) {
  return (
    <div className="flex justify-center w-full my-6 light-mode-tweet">
      <div className="w-full max-w-[550px]" data-theme="dark">
        <Tweet id={id} />
      </div>
    </div>
  )
}
