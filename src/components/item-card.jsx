import React, { Fragment } from 'react'

import PropTypes from 'prop-types'

import './item-card.css'

const ItemCard = (props) => {
  return (
    <div className={`item-card-gallery-card ${props.rootClassName} `}>
      <div className="item-card-container1">
        <div className="item-card-container2">
          <button type="button" className="item-card-button button">
            <span className="item-card-text1">
              {props.text ?? (
                <Fragment>
                  <span className="item-card-text2">View Order</span>
                </Fragment>
              )}
            </span>
            <img
              alt={props.imageAlt2}
              src={props.imageSrc2}
              className="item-card-image"
            />
          </button>
        </div>
        <div className="item-card-container3"></div>
      </div>
    </div>
  )
}

ItemCard.defaultProps = {
  text: undefined,
  imageAlt2: 'image',
  imageSrc2: '/iconvieworder-200h.png',
  rootClassName: '',
}

ItemCard.propTypes = {
  text: PropTypes.element,
  imageAlt2: PropTypes.string,
  imageSrc2: PropTypes.string,
  rootClassName: PropTypes.string,
}

export default ItemCard
