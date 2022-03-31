//
//  DrinkingEstablishmentCell.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 3/8/22.
//

import UIKit

// Sets UI fields for the folling attributes
class DrinkingEstablishmentCell: UICollectionViewCell {
            
    @IBOutlet var titleLabel: UILabel!
    @IBOutlet var tagLabel: UILabel!
    @IBOutlet var accommodationsLabel: UILabel!
    @IBOutlet var ratingLabel: UILabel!
    @IBOutlet var countLabel: UILabel!
    
    // Rounds the edges of the DrinkingEstablishmentCell Cells in DrinkingEstablishmentListViewController
    override func layoutSubviews() {
        self.layer.cornerRadius = 9.0
        self.layer.masksToBounds = true
    }
}
