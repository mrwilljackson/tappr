import { Patua_One, Montserrat } from "next/font/google"

export const patuaOne = Patua_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-patua-one",
  display: "swap",
})

export const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})
