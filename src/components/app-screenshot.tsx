import { PhoneFrame } from "./phone-frame"

interface AppScreenshotProps {
  src: string
  alt: string
  title: string
  description: string
}

export function AppScreenshot({ src, alt, title, description }: AppScreenshotProps) {
  return (
    <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-start">
      <div className="relative w-full max-w-[300px] flex-shrink-0">
        <div className="absolute -left-4 -top-4 h-72 w-72 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <PhoneFrame
            src={src || "/placeholder.svg"}
            width={300}
            height={600}
            alt={alt}
            rotate={-10}
            shadow={true}
            shadowOffset={-15}
          />
        </div>
      </div>
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <h3 className="text-2xl font-bold font-patua">{title}</h3>
        <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-md font-montserrat">{description}</p>
      </div>
    </div>
  )
}
