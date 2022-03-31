//
//  ReviewCell.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/27/22.
//

import UIKit

// Labels for the reviews cell
class ReviewCell: UICollectionViewCell {

    @IBOutlet var titleLabel: UILabel!
    @IBOutlet var dateLabel: UILabel!
    @IBOutlet var nameLabel: UILabel!
    @IBOutlet var reviewLabel: UILabel!
    @IBOutlet var ratingsView: RatingsView!
}
