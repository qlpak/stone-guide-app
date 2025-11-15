import { render, screen } from '@testing-library/react'
import LoadingSkeleton from './LoadingSkeleton'

describe('LoadingSkeleton', () => {
  it('renders three skeleton elements', () => {
    const { container } = render(<LoadingSkeleton />)
    
    const skeletonElements = container.querySelectorAll('.animate-shimmer')
    expect(skeletonElements.length).toBe(3)
  })

  it('applies correct styling classes', () => {
    const { container } = render(<LoadingSkeleton />)
    
    const firstSkeleton = container.querySelector('.h-24')
    expect(firstSkeleton).toBeInTheDocument()
    expect(firstSkeleton).toHaveClass('rounded-xl', 'bg-zinc-800/50')
  })
})
