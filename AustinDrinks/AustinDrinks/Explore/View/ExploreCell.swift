//
//  ExploreCell.swift
//  AustinDrinks
//
//  Created by Austin Faulkner on 2/12/22.
//

import UIKit

// More business logic about how the Explore panes will present in the Explore Path (see Acceptance Tests)
class ExploreCell: UICollectionViewCell {
   
    @IBOutlet var exploreImageView: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        exploreImageView.layer.cornerRadius = 9
        exploreImageView.layer.masksToBounds = true
    }
}
