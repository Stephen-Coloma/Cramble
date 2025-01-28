'use client'

import {PageTitle, PageTitleProps} from "@/components/page-title"
import { LibraryBig } from 'lucide-react'
import { Deck, DeckProps } from "@/components/deck"
import { useEffect } from "react"
import { NextResponse } from "next/server"
import { AxiosError, AxiosResponse } from "axios"

export default function MyDecks() {
  const pageDetails: PageTitleProps = {
    title: 'My Decks',
    desc: 'Manage your decks and flashcards easily here',
    iconColor: '#303030',
    iconBg: 'bg-gray-200',
    Icon: LibraryBig
  }

  useEffect(() => {
    const axios = require('axios');
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      url: 'http://localhost:3001/api/decks',
      withCredentials: true
    };

    axios.request(config)
    .then((response: AxiosResponse) => {
      console.log(JSON.stringify(response.data));
    })
    .catch((error: AxiosError) => {
      console.log(error.response?.data);
    });

  }, []);//Runs only on the first render [] dependency



  return (
    <div className=" w-full border-red-900 border-4">
      <PageTitle {...pageDetails}/>
      <div className="border-blue-900 border-4">
        {/* <Deck></Deck> */}
      </div>
    </div>
  )
} 

// UPDATE THE SWAGGER DOCUMENTATION  FOR THE get /api/decks api