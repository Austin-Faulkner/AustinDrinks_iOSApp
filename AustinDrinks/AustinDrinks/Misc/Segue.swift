//
//  Segue.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/30/22.
//

import Foundation // one of Apple's core frameworks. To read more about it visit https://developer.apple.com/documentation/foundation

// An enum containing all segues 
enum Segue: String {
    case showDetail
    case showRating
    case showReview
    case showAllReviews
    case establishmentList
    case locationList
    case showPhotoReview
    case showPhotoFilter
    // Added:
    case showCity
}
