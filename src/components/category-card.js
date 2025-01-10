import React from 'react'

import PropTypes from 'prop-types'

import './category-card.css'

const CategoryCard = (props) => {
  return (
    <div className="category-card-category-card">
      <span className="category-card-text">{props.name}</span>
    </div>
  )
}

CategoryCard.defaultProps = {
  name: 'Desks',
}

CategoryCard.propTypes = {
  name: PropTypes.string,
}

export default CategoryCard
