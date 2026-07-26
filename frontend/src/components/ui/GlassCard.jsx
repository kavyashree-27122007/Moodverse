import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', animate = true, ...props }) => {
  const Card = animate ? motion.div : 'div';
  
  const animationProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <Card
      className={`glass-card ${className}`}
      {...animationProps}
      {...props}
    >
      {children}
    </Card>
  );
};
