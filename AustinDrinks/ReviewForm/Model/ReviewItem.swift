//
//  ReviewItem.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/1/22.
//

import UIKit

struct ReviewItem {
    var date: Date?
    var rating: Double?
    var title: String?
    var name: String?
    var customerReview: String?
    var establishmentID: Int64?
    var uuid = UUID() 
}

extension ReviewItem {
    init(review: Review) {
        self.date = review.date
        self.rating = review.rating
        self.title = review.title
        self.name = review.name
        self.customerReview = review.customerReview
        self.establishmentID = review.establishmentID
        if let reviewUUID = review.uuid {
            self.uuid = reviewUUID
        }
    }
}
