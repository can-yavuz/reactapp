import Link from 'next/link'
import React from 'react'
import Image from "next/image";

const Logo = () => {
  return (
    <Link href="/" className="">
        <Image 
        src='/logo.png'
        alt='logo'
        width={60}
        height={40}
        className="mr-4 rounded-lg"/>
    </Link>
  )
}

export default Logo