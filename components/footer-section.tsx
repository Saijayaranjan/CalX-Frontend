"use client"

import { Twitter, Github, Linkedin } from "lucide-react"
import Link from "next/link"

export function FooterSection() {
  return (
    <footer className="w-full max-w-[1320px] mx-auto px-5 flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0 py-10 md:py-[70px]">
      {/* Left Section: Logo, Description, Social Links */}
      <div className="flex flex-col justify-start items-start gap-6 p-4 md:p-8">
        <div className="flex flex-col gap-2">
          <Link href="/" className="flex gap-2 items-center">
            <div className="text-center text-foreground text-xl font-semibold leading-4 font-nexa">CalX</div>
          </Link>
          <p className="text-muted-foreground text-sm font-normal leading-relaxed text-left max-w-xs">The smart calculator for serious work. Powered by ESP32 with AI capabilities, cloud sync, and seamless device management — built for engineers, students, and professionals who demand more.</p>
        </div>
        <div className="flex justify-start items-start gap-3">
          <a href="#" aria-label="Twitter" className="w-4 h-4 flex items-center justify-center hover:opacity-70 transition-opacity">
            <Twitter className="w-full h-full text-muted-foreground" />
          </a>
          <a href="#" aria-label="GitHub" className="w-4 h-4 flex items-center justify-center hover:opacity-70 transition-opacity">
            <Github className="w-full h-full text-muted-foreground" />
          </a>
          <a href="#" aria-label="LinkedIn" className="w-4 h-4 flex items-center justify-center hover:opacity-70 transition-opacity">
            <Linkedin className="w-full h-full text-muted-foreground" />
          </a>
        </div>
      </div>
      {/* Right Section: Product, Support, Legal */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 p-4 md:p-8 w-full md:w-auto">
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Product</h3>
          <div className="flex flex-col justify-end items-start gap-2">
            <Link href="#features-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Features
            </Link>
            <Link href="#specs-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Specifications
            </Link>
            <Link href="/dashboard" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Dashboard Demo
            </Link>
            <Link href="#faq-section" className="text-foreground text-sm font-normal leading-5 hover:underline">
              FAQ
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Support</h3>
          <div className="flex flex-col justify-center items-start gap-2">
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Documentation
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Firmware Downloads
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Community
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Contact
            </a>
          </div>
        </div>
        <div className="flex flex-col justify-start items-start gap-3">
          <h3 className="text-muted-foreground text-sm font-medium leading-5">Legal</h3>
          <div className="flex flex-col justify-center items-start gap-2">
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Terms of Use
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-foreground text-sm font-normal leading-5 hover:underline">
              Open Source
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
